function startWebSocketServer(server){
    const { WebSocketServer } = require('ws');
    const webSocketServer = new WebSocketServer({ server: server});

    return webSocketServer;
}

module.exports = { 
    startWebSocketServer
};