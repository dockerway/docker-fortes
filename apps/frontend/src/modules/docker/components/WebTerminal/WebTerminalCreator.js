import WebSocketClientCreator from "../../../websockets/WebSocketClientCreator";

import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';

import { v4 as uuidv4 } from 'uuid';
import { string, object } from 'zod';
import { load as loadDotEnv } from 'dotenv';

const WebSocketServerUrlSchema = string().url()
const TaskIDsSchema = object({
    nodeId: string(),
    containerId: string()
})

export class WebTerminal {
    constructor(terminalDomElement, taskIDs) {
        TaskIDsSchema.parse(taskIDs)

        this.wsId = uuidv4()
        this.webSocket = null

        this.terminal = new Terminal(({convertEol: true}))
        this.fitAddon = new FitAddon()

        this.resizeObserver = new ResizeObserver(() => this.handleTerminalResize())

        this.taskIDs = taskIDs
        this.terminalDomElement = terminalDomElement
    }

    handleTerminalResize(){
        this.fitAddon.fit()
    }

    resetTerminal() {
        try {
            this.terminal.clear()
            this.terminal.reset()
        } catch (error) {
            console.error(`An error happened at the resetTerminal method: '${error}'`)
        }
    }

    loadFitAddon() {
        try {
            this.terminal.loadAddon(this.fitAddon)
            this.fitAddon.activate(this.terminal)
            this.fitAddon.fit()

            window.addEventListener('resize', () => this.fitAddon.fit(), true)
            this.resizeObserver.observe(this.terminalDomElement)
        } catch (error) {
            console.error(`An error happened at the loadFitAddon method: '${error}'`)
        }
    }

    handleTerminalUserInput() {
        try {
            this.terminal.onData((payload) => {
                const userData = {
                    wsId: this.wsId,
                    nodeId: this.taskIDs.nodeId,
                    containerId: this.taskIDs.containerId,
                    payload: payload
                }

                this.webSocket.send(JSON.stringify(userData))
            })
        } catch (error) {
            console.error(`An error happened at the handleTerminalUserInput method: '${error}'`)
        }
    }

    prepareTerminal() {
        try {
            this.loadFitAddon()
            this.resetTerminal()
            this.terminal.open(this.terminalDomElement)


            this.handleTerminalUserInput()
        } catch (error) {
            console.error(`An error happened at the prepareTerminal method: '${error}'`)
        }
    }

    async renderTerminal() {
        try {
            this.prepareTerminal()
            await this.connectToBackendWebSocketsServer()
            this.sendFirstMessage()
            this.fitAddon.fit()

        } catch (error) {
            console.error(`An error happened at the renderTerminal method: '${error}'`)
        }
    }

    getBackendWebsocketsServerUrl() {
        try {
            let websocketsServerUrl = window.location.origin.replace(/http/, "ws")
            loadDotEnv()

            if (process.env.VUE_APP_MODE && process.env.VUE_APP_MODE === 'localhost') {
                const localhostPort = process.env.VUE_APP_APIHOST.slice(-4)
                websocketsServerUrl = `ws://localhost:${localhostPort}`
            }

            // Validate the URL using Zod
            WebSocketServerUrlSchema.parse(websocketsServerUrl)

            return websocketsServerUrl
        } catch (error) {
            console.error(`An error happened at the getBackendWebsocketsServerUrl method: '${error}'`)
        }
    }

    connectToBackendWebSocketsServer() {
        try {
            return new Promise((resolve, reject) => {
                const connectionToBackWSS = new WebSocketClientCreator(this.getBackendWebsocketsServerUrl(), '/terminal').ConnectionToWebSocketServer

                connectionToBackWSS.addEventListener('open', () => {
                    this.webSocket = connectionToBackWSS
                    this.webSocket.addEventListener('message', (message) => {
                        const backMessage = JSON.parse(message.data)

                        if (backMessage.containerId == this.taskIDs.containerId) {
                            this.terminal.write(backMessage.payload)
                        }
                    })
                    resolve()
                })
            })
        } catch (error) {
            console.error(`An error happened at the connectToBackendWebSocketsServer method: '${error}'`)
        }
    }

    sendFirstMessage() {
        try {
            const firstMessage = {
                wsId: this.wsId,
                nodeId: this.taskIDs.nodeId,
                containerId: this.taskIDs.containerId,
                terminalSelected: this.terminalSelected,
                payload: '',
            }

            this.webSocket.send(JSON.stringify(firstMessage))
        } catch (error) {
            console.error(`An error happened at the sendFirstMessage method: '${error}'`)
        }
    }
}
