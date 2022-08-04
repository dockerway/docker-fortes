const httpServer = require('./http-server.js')
const { WebSocketServer } = require('ws');
const webSocketServer = new WebSocketServer({ server: httpServer});

module.exports = webSocketServer
