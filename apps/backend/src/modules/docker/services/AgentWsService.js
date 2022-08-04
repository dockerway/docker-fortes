import wsServer from '../../../websocket-server'
import agentWsManager from "../managers/AgentWsManager";

const startWebSocketServerWithAgent = () => {
    wsServer.on('connection', (ws) => {



            ws.on('message', async (data) => {
                console.log("Fortes WS clients size:", wsServer.clients.size)

                let json = JSON.parse(data.toString()) // {nodeId: zz, containerId: xx, payload: yy }

                //INICIALIZO EL ID SI NO EXISTE
                if (!ws.id) {
                    ws.id = json.containerId
                }

                //Obtengo el AgentWsClient
                await agentWsManager.syncAgentWsClient(json.nodeId, json.containerId, ws, data)
            })
        }
    )
}


module.exports = startWebSocketServerWithAgent
