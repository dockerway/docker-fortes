/**
 * WebSocketClientCreator is a class that manages WebSocket connections.
 * @class
 */
export default class WebSocketClientCreator {
    /**
     * Constructs a new WebSocketClientCreator.
     * @param optional {string|null} - The WebSocket server path.
     */
    constructor(server, path) {
        if (!server || !path) throw new Error("Server and path parameters are required")

        this.path = path
        this.WebSocketsServer = server

        this.WebSocketsServerUrl = `${this.WebSocketsServer}${this.path}`
        this.ConnectionToWebSocketServer = (new WebSocket(this.WebSocketsServerUrl))
    }

    set initialMessage(message) {
        this.initialMessage = message
    }

    sendInitialMessage() {
        try {
            if (!this.initialMessage) throw new Error("You must set the initial message first")
            this.ConnectionToWebSocketServer.send(this.initialMessage)
        } catch (error) {
            console.error(`An error happened at the sendInitialMessage function: '${error.message}'`)
            throw error
        }
    }

}
