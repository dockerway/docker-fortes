/**
 * WebSocketClientCreator is a class that manages WebSocket connections.
 * @class
 */
export default class WebSocketClientCreator {
    /**
     * Constructs a new WebSocketClientCreator.
     * @param optional {string|null} - The WebSocket server path.
     */
    constructor(path = null) {
        this.path = path
        this.WebSocketsServer = process.env.VUE_APP_APIHOST.replace(/http/, "ws")

        this.WebSocketsServerUrl = this.path ? `${this.WebSocketsServer}${this.path}` : `${this.WebSocketsServer}`
        this.ConnectionToWebSocketServer = (new WebSocket(this.WebSocketsServerUrl))
    }

    set initialMessage(message){
        this.initialMessage = message
    }

    sendInitialMessage(){
        if (!this.initialMessage) throw new Error("You must set the initial message first")

        this.ConnectionToWebSocketServer.send(this.initialMessage)
    }

}
