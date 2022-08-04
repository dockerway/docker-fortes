<template>
  <v-container>
    <WebTerminal v-if="webSocket !== null"
                 :webSocket="webSocket"
                 :nodeId="nodeId"
                 :containerId="containerId"
    />
  </v-container>
</template>

<script>
import WebTerminal from "@/modules/docker/components/WebTerminal/WebTerminal";

export default {
  name: "WebTerminalPage",
  components: {WebTerminal},
  computed: {
    taskId() {
      return this.$route.params.taskid
    },
    containerId() {
      return this.$route.params.containerid
    },
    nodeId() {
      return this.$route.params.nodeid
    },
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
      connectionToBackWSS.randomID = Math.floor(Math.random() * 5000)
      this.webSocket = connectionToBackWSS
    }
  }
}
</script>
