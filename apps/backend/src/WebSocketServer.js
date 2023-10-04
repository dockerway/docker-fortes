import { WebSocketServer } from 'ws';

export const terminalWebSocketServer = new WebSocketServer({ noServer: true })
export const logsWebSocketServer = new WebSocketServer({ noServer: true })

