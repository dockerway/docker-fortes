function startWebSocketServer(){
    const { WebSocketServer } = require('ws');
    const webSocketServer = new WebSocketServer({ port: 9995 });

    return webSocketServer;
}

module.exports = { 
    startWebSocketServer
};