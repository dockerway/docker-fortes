import { logsWebSocketServer } from '../../../WebSocketServer.js';
import { findTaskLogs } from './DockerTaskService';
import winston from 'winston'

export default function startLogWebSocketServer(){
    logsWebSocketServer.on('connection', (webSocketClient) => {
            winston.info("New connection at logsWebSocketServer")
            
            webSocketClient.on('message', async (data) => {
                const {taskId, filters} = JSON.parse(data.toString())
                findTaskLogs({taskId, filters, webSocketClient})
            })
        }
    )
}

