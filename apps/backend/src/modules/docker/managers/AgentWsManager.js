import {dnsTaskRunningByServiceAndNode} from "../services/DockerTaskService";
import {WebSocket} from "ws";
import wsServer from "../../../websocket-server";


class AgentWsManager{

    constructor() {
        this.wsClients = []
    }

    /**
     * Busca un websocket existente de un agente y si no lo crea, luego lo retorna
     * @param nodeId
     * @returns {Promise<WebSocket>}
     */
     findAgentWsClient(nodeId, containerId){
            return this.wsClients.find(wsClient => wsClient.nodeId === nodeId && wsClient.containerId === containerId)
    }

    /**
     * Sincroniza un websocket front con un web socket agent
     * @param nodeId
     */
    async syncAgentWsClient(nodeId, containerId, wsOrigin, data){
        try{
            let wsClient = this.findAgentWsClient(nodeId, containerId)
            if(!wsClient){
                console.error("syncAgentWsClient wsClient not found. Ask to create.", nodeId)
                wsClient = await this.createAgentWsClient(nodeId, containerId, wsOrigin)
            }

            wsClient.send(data)

        }catch (e) {
            console.error("Error getting Agent Ws Client", e)
        }
    }

    /**
     * Construye la URL del WS Agent
     * @param nodeId
     * @returns {Promise<string>}
     */
    async getAgentWsUrl(nodeId){
        const DEFAULT_AGENT_SERVICE_NAME = "dockerway_incatainer-agent";
        const agentServiceName = process.env.AGENT_SERVICE_NAME ? process.env.AGENT_SERVICE_NAME : DEFAULT_AGENT_SERVICE_NAME;
        const DNS = process.env.NODE_MODE === 'localhost' ? 'localhost:4000' : await dnsTaskRunningByServiceAndNode(agentServiceName, nodeId);
        return  `ws://${DNS}`;
    }

    /**
     * Crea un websocket client contra un agente
     * @param nodeId
     * @returns {Promise<WebSocket>}
     */
    createAgentWsClient(nodeId, containerId, wsOrigin){

        return new Promise(async (resolve, reject) => {
            console.log('Trying connection of AgentWSClient. Nodeid:'+nodeId);
            const WSURL = await this.getAgentWsUrl(nodeId)
            const agentWSClient = new WebSocket(WSURL);
            agentWSClient.nodeId = nodeId
            agentWSClient.containerId = containerId
            this.wsClients.push(agentWSClient)

            agentWSClient.on('open', () => {
                console.log('AgentWSClient connected. Nodeid:'+nodeId);
                agentWSClient.onmessage = ({data}) => {
                    console.log('AgentWSClient onmessage:',data);
                    wsOrigin.send(data)
                }
                resolve(agentWSClient)
            })

            agentWSClient.on('close', () => {
                console.log('WS client closed to agent Server');
                reject()
            })

        })


    }




}

const agentWsManager =  new AgentWsManager()

export default agentWsManager
