import { dnsTaskRunningByServiceAndNode } from "../services/DockerTaskService";
import { WebSocket } from "ws";
import wsServer from "../../../websocket-server";


class AgentWsManager {

    constructor() {
        this.wsAgents = []
    }

    /**
     * Busca un websocket existente de un agente y si no lo crea, luego lo retorna
     * @param wsId
     * @returns <WebSocket>
     */
    findAgentWsClient(wsId) {
        return this.wsAgents.find(wsAgent => wsAgent.wsId === wsId)
    }

    /**
     * Sincroniza un websocket front con un web socket agent
     * @param wsId
     * @param wsOriginal
     * @param nodeId
     * @param containerId
     * @param data
     * @returns {Promise<void>}
     */
    async syncAgentWsClient(wsId, wsClient, nodeId, containerId, data) {
        try {
            let wsAgent = this.findAgentWsClient(wsId)
            if (!wsAgent) {
                console.error("syncAgentWsClient wsClient not found. Ask to create.", nodeId)
                wsAgent = await this.createAgentWsClient(wsId, wsClient, nodeId, containerId)
            }

            wsAgent.send(data)

        } catch (e) {
            console.error("Error getting Agent Ws Client", e)
        }
    }

    /**
     * Construye la URL del WS Agent
     * @param nodeId
     * @returns {Promise<string>}
     */
    async getAgentWsUrl(nodeId) {
        const DEFAULT_AGENT_SERVICE_NAME = "dockerway_incatainer-agent";
        const agentServiceName = process.env.AGENT_SERVICE_NAME ? process.env.AGENT_SERVICE_NAME : DEFAULT_AGENT_SERVICE_NAME;
        const DNS = process.env.NODE_MODE === 'localhost' ? 'localhost:4000' : `${await dnsTaskRunningByServiceAndNode(agentServiceName, nodeId)}:${process.env.AGENT_PORT}`;
        return `ws://${DNS}`;
    }

    /**
     * Crea un websocket client contra un agente
     * @param wsId
     * @param wsClient
     * @param nodeId
     * @param containerId
     * @returns {Promise<WebSocket>}
     */
    createAgentWsClient(wsId, wsClient, nodeId, containerId) {
        try {
            return new Promise(async (resolve, reject) => {
                console.log('Trying connection of AgentWSClient. Nodeid:' + nodeId);
                const WSURL = await this.getAgentWsUrl(nodeId)

                console.log(`agent ws url: '${WSURL}'`)

                const wsAgent = new WebSocket(WSURL);
                wsAgent.wsId = wsId
                wsAgent.nodeId = nodeId
                wsAgent.containerId = containerId
                this.wsAgents.push(wsAgent)

                wsAgent.on('open', () => {
                    console.log('AgentWSClient connected. wsId:' + wsId);
                    wsAgent.onmessage = ({ data }) => {
                        console.log('AgentWSClient onmessage:', data);
                        wsClient.send(data)
                    }
                    resolve(wsAgent)
                })

                wsAgent.on('close', () => {
                    console.log('WS client closed to agent Server');
                    reject()
                })

            })
        } catch (error) {
            console.error(`An error happened at the createAgentWsClient function: '${error.message}'`)
        }
    }




}

const agentWsManager = new AgentWsManager()

export default agentWsManager
