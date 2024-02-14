import { dnsTaskRunningByServiceAndNode } from "../services/DockerTaskService";
import { DefaultLogger as winston } from "@dracul/logger-backend";
import { WebSocket } from "ws";

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
        try {

            if(this.wsAgents.length > 0){
                const wsAgentsWithLimitedInfo = this.wsAgents.map((wsAgent) => {
                    const limitedInfoAgentWs = {
                        id: wsAgent.wsId,
                        nodeId: wsAgent.nodeId,
                        containerId: wsAgent.containerId
                    }
    
                    return limitedInfoAgentWs
                })    
            }

            return this.wsAgents.find(wsAgent => wsAgent.wsId === wsId)
        } catch (error) {
            winston.error(`An error happened at the findAgentWsClient: '${error}'`)
        }
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

        } catch (error) {
            winston.error(`An error happened at the syncAgentWsClient method: '${error}'`)
        }
    }

    /**
     * Construye la URL del WS Agent
     * @param nodeId
     * @returns {Promise<string>}
     */
    async getAgentWsUrl(nodeId) {
        try {
            if (!nodeId) throw new Error("nodeId parameter was not provided")

            const DEFAULT_AGENT_SERVICE_NAME = "dockerway_incatainer-agent"
            const agentServiceName = process.env.AGENT_SERVICE_NAME ? process.env.AGENT_SERVICE_NAME : DEFAULT_AGENT_SERVICE_NAME
            
            const DNS = process.env.NODE_MODE === 'localhost' ? `localhost:${process.env.AGENT_PORT}` : `${await dnsTaskRunningByServiceAndNode(agentServiceName, nodeId)}:${process.env.AGENT_PORT}`
            const agentWsUrl = `ws://${DNS}`

            winston.info(`agentWsUrl: '${agentWsUrl}'`)
            return agentWsUrl
        } catch (error) {
            winston.error(`An error happened at the getAgentWsUrl function: ${error}`)
            throw error
        }
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
            return new Promise(async (resolve, _reject) => {
                winston.info(`Starting connection to docker agent websocket. The docker agent received node id is: '${nodeId}'`)

                const WSURL = await this.getAgentWsUrl(nodeId)
                const wsAgent = new WebSocket(WSURL)

                wsAgent.wsId = wsId
                wsAgent.nodeId = nodeId
                wsAgent.containerId = containerId

                this.wsAgents.push(wsAgent)

                wsAgent.on('open', () => {
                    winston.info(`A connection to '${WSURL}' was opened. websocket client id generated: '${wsId}'`)

                    wsAgent.onmessage = ({ data }) => {
                        wsClient.send(data)
                    }

                    resolve(wsAgent)
                })

                wsAgent.on('close', () => {
                    winston.warn(`The connection to '${WSURL}' was closed`)
                })
    
                wsAgent.on('error', (error) => {
                    winston.error(`An error happened while we tried to communicate with the docker agent at '${WSURL}': ${error.message ? error.message : error}`)
                })
            })
        } catch (error) {
            winston.error(`An error happened at the createAgentWsClient function: '${error.message}'`)
        }
    }
}

const agentWsManager = new AgentWsManager()
export default agentWsManager
