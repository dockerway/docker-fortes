<template>
  <v-container>
    <WebTerminal :webSocket="webSocket" v-if="webSocket !== null"/>
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
    this.showTerminal()
  },
  beforeDestroy(){
    this.closeWebSocket()
  },
  methods: {
    async closeWebSocket() {
      await this.webSocket.close()
    },

    async showTerminal() {
      const axios = require("axios")

      this.webSocket ? this.closeWebSocket() : null;

      axios.get(`/api/docker/task/${this.nodeId}/${this.containerId}/runTerminal/sh`)
          .then((response) => {
            if (response.data == 'Linked') {
              try{
                const BackWSSURL = window.location.origin.replace(/http/, "ws").replace(/:[0-9]+/,':9995')
                const connectionToBackWSS = new WebSocket(BackWSSURL)

                this.webSocket = connectionToBackWSS
              } catch (error){
                console.error(error)
              }
            }
          });
    }
  }
}
</script>