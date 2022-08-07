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

export default {
  name: "WebTerminalPage",
  components: {WebTerminal},
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
    this.wsSocketConnect();
  },
  beforeDestroy() {
    this.webSocket.close();
  },
  methods: {
    async wsSocketConnect() {
      const BackWSSURL = process.env.VUE_APP_APIHOST ? process.env.VUE_APP_APIHOST.replace(/http/, "ws") :  window.location.origin.replace(/http/, "ws")
      const connectionToBackWSS = new WebSocket(BackWSSURL) // Front -> Back
      connectionToBackWSS.onopen = () => {
        this.webSocket = connectionToBackWSS
      }

    }
  }
}
</script>
