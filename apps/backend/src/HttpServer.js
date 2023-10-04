import { terminalWebSocketServer, logsWebSocketServer } from './WebSocketServer.js';
import { createServer } from 'http';

const httpServer = createServer()
httpServer.on('upgrade', (request, socket, head) => { //WebSocket routing
    if (request.url === '/') {
      terminalWebSocketServer.handleUpgrade(request, socket, head, (ws) => {
        terminalWebSocketServer.emit('connection', ws, request)
      })
    }else if (request.url === '/logs') {
      logsWebSocketServer.handleUpgrade(request, socket, head, (ws) => {
        logsWebSocketServer.emit('connection', ws, request)
      })
    } else {
      socket.destroy()
    }
  })

export default httpServer