import { terminalWebSocketServer } from '../../../WebSocketServer.js';
import agentWsManager from "../managers/AgentWsManager";

export const startWebSocketServerWithAgent = () => {
    terminalWebSocketServer.on('connection', (wsClient) => {
        wsClient.on('message', async (data) => {
                console.log("Fortes WS clients size:", terminalWebSocketServer.clients.size)

                let json = JSON.parse(data.toString()) // {wsId: uu, nodeId: zz, containerId: xx, payload: yy }

                //INICIALIZO EL ID SI NO EXISTE
                if (!wsClient.wsId) {
                    wsClient.wsId = json.wsId
                    wsClient.nodeId = json.nodeId
                    wsClient.containerId = json.containerId
                }

                //Obtengo el AgentWsClient
                await agentWsManager.syncAgentWsClient(json.wsId, wsClient, json.nodeId, json.containerId,  data)
            })
        }
    )
}

