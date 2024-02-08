<template>
  <div id="wrapper">
    <v-row align="center" class="firstRow mt-5">
      <v-col cols="12" md="3" sm="4">
        <v-combobox label="Filtrar" v-model="since" clearable outlined hide-selected persistent-hint
          @change="reconnectToWebSocketsServer()" :items="[
            'Último día', 'Últimas 4 horas', 'Última hora', '30 minutos'
          ]" />
      </v-col>
      <v-col cols="12" md="3" sm="4">
        <v-text-field label="Buscar" v-model="filters.search" outlined @input="searchInTerminal()" clearable />
      </v-col>
      <v-col cols="12" md="2" sm="4">
        <v-text-field label="Cantidad de lineas" v-model="filters.tail" type="number" outlined @keydown="validateLimit"
          :max="limitLogLines" min="0" />
      </v-col>
      <v-col cols="12" md="2" sm="4">
        <v-switch label="Mostrar timestamps" v-model="filters.timestamps" inset @change="reconnectToWebSocketsServer()" />
      </v-col>
      <v-col cols="12" md="2" sm="4">
        <v-switch label="Pausar logs" v-model="refresh" @change="refreshLogs()" inset />
      </v-col>
    </v-row>

    <v-spacer></v-spacer>

    <div id="terminalAndProgressLine">
      <v-progress-linear v-if="loading" indeterminate />
      <div ref="mainDiv" id="mainDiv"></div>
    </div>


  </div>
</template>

<script>
import WebSocketClientCreator from "../../../websockets/WebSocketClientCreator";
import { SearchAddon } from 'xterm-addon-search';
import { FitAddon } from 'xterm-addon-fit';
import { Terminal } from 'xterm';
import { config } from 'dotenv';
config()

export default {
  name: "LogVisualizer",
  props: {
    task: Object,
    service: Object,
    tail: Number
  },
  data() {
    return {
      webSocket: null,
      fitAddon: null,
      searchAddon: null,
      terminal: null,
      filters: {
        tail: this.tail,
        since: 0,
        search: '',
        timestamps: false
      },
      since: '',
      refresh: false,
      refreshRate: 5,
      loading: true,

      dataIsLoading: false,

      numberOfLines: 0,
      limitLogLines: this.tail
    }
  },
  async beforeMount() {
    await this.connectToWebSocketsServer()
  },
  mounted() {
    this.terminal = new Terminal({ convertEol: true, disableStdin: true, enableWebGLRenderer: false })

    this.terminal.attachCustomKeyEventHandler((e) => {
      if (this.terminal.hasSelection() && e.ctrlKey && e.key.toLowerCase() === 'c') {
        navigator.clipboard.writeText(this.terminal.getSelection())
        this.terminal.clearSelection()
        return false
      }
      return true
    })

    this.fitAddon = new FitAddon()
    this.searchAddon = new SearchAddon()

    this.terminal.loadAddon(this.fitAddon)
    this.terminal.loadAddon(this.searchAddon)

    this.fitAddon.activate(this.terminal)
    this.searchAddon.activate(this.terminal)
    this.terminal.open(this.$refs.mainDiv)
    this.fitAddon.fit()

    const resizeObserver = new ResizeObserver(() => this.fitAddon.fit())
    resizeObserver.observe(this.$refs.mainDiv)

  },
  beforeDestroy() {
    if (this.webSocket) this.webSocket.close()

    this.fitAddon.dispose()
    this.terminal.dispose()
    this.searchAddon.dispose()
  },
  watch: {
    refresh(isTrue) {
      if (isTrue) this.refreshLogs()
    }
  },
  methods: {
    async connectToWebSocketsServer() {
      try {
        let serverUrl = window.location.origin.replace(/http/, "ws")

        if (process.env.VUE_APP_MODE && process.env.VUE_APP_MODE === 'localhost') {
          const localhostPort = process.env.VUE_APP_APIHOST.slice(-4)
          serverUrl = `ws://localhost:${localhostPort}`
        }

        const connectionToWebSocketServer = (new WebSocketClientCreator(serverUrl, '/logs')).ConnectionToWebSocketServer
        connectionToWebSocketServer.addEventListener('open', () => {
          this.webSocket = connectionToWebSocketServer

          this.listenToMessagesAndWriteThemToTheTerminal()
          this.sendGetLogsMessage()
        })
      } catch (error) {
        console.error(`An error happened at the connectToWebSocketsServer method: ${error.message ? error.message : error}`)
        throw error
      }
    },

    sendGetLogsMessage() {
      this.fitAddon.fit()

      this.filters.tail = this.filters.tail.toString()
      this.filters.since = this.sinceInMinutes(this.since)

      const getLogsMessage = {
        taskId: this.task.id,
        filters: this.filters
      }

      this.webSocket.send(JSON.stringify(getLogsMessage))
    },

    listenToMessagesAndWriteThemToTheTerminal() {
      this.fitAddon.fit()
      this.webSocket.addEventListener('message', ({ data }) => {
        this.terminal.write(data)
        if (this.loading) this.loading = false
      })
    },

    async reconnectToWebSocketsServer() {
      this.terminal.clear()
      this.webSocket.close()
      this.loading = true

      await this.connectToWebSocketsServer()
    },

    searchInTerminal() {
      try {
        this.reconnectToWebSocketsServer()
      } catch (error) {
        console.error(`An error happened at the search terminal function: '${error}'`)
      }
    },

    validateLimit() {
      const tailInput = Number(this.filters.tail)
      const maxLimit = Number(this.limitLogLines)

      if (tailInput > maxLimit) this.filters.tail = maxLimit
    },

    sinceInMinutes(since) {
      switch (since) {
        case '':
          return 0
        case 'Último día':
          return this.createUnixTimestampBySubtractingMinutes(1440)
        case 'Últimas 4 horas':
          return this.createUnixTimestampBySubtractingMinutes(240)
        case 'Última hora':
          return this.createUnixTimestampBySubtractingMinutes(60)
        case '30 minutos':
          return this.createUnixTimestampBySubtractingMinutes(30)
        default:
          return 0
      }
    },

    createUnixTimestampBySubtractingMinutes(minutesToSubtract) {
      const currentDate = new Date()
      currentDate.setMinutes(currentDate.getMinutes() - minutesToSubtract)
      const unixTimestamp = Math.floor(currentDate.getTime() / 1000)

      return unixTimestamp
    },

    refreshLogs() {
      try {
        if (this.refresh) {
          this.webSocket.close()
        } else {
          this.reconnectToWebSocketsServer()
        }
      } catch (error) {
        console.error(`An error happened at the refreshLogs method: ${error.message ? error.message : error}`)
      }
    },
  }
}

</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');

#wrapper {
  overflow: hidden;
}

.firstRow {
  height: 8vh;
}

#terminalAndProgressLine {
  margin-top: 5vh;
}
</style>