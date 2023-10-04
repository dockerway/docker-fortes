<template>
  <v-container>
    <WebTerminal v-if="webSocket !== null"
      :webSocket="webSocket"
      :task="task"
      :service="service"
      :terminalSelected="terminal"
    />
  </v-container>
</template>

<script>
import WebTerminal from "@/modules/docker/components/WebTerminal/WebTerminal";
import WebSocketClientCreator from "../../../websockets/WebSocketClientCreator";

export default {
  name: "WebTerminalPage",
  components: { WebTerminal },
  computed: {
    task() {
      return JSON.parse(window.atob(this.$route.params.task));
    },
    service() {
      return JSON.parse(window.atob(this.$route.params.service));
    },
    terminal() {
      return window.atob(this.$route.params.terminal);
    }
  },
  data() {
    return {
      webSocket: null
    }
  },
  mounted() {
    this.wsSocketConnect()
  },
  beforeDestroy() {
    this.webSocket.close()
  },
  methods: {
    async wsSocketConnect() {
      const connectionToBackWSS = (new WebSocketClientCreator()).ConnectionToWebSocketServer

      connectionToBackWSS.addEventListener('open', () => {
        this.webSocket = connectionToBackWSS
      })
    }
  }
}
</script>
