<template>
  <v-container>
    <WebTerminal v-if="webSocket !== null" :webSocket="webSocket" :containerId="containerId"/>
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
    async showTerminal() {
      const axios = require("axios")

      axios.get(`/api/docker/task/${this.nodeId}/${this.containerId}/runTerminal/sh`) //Back -> Agent
          .then((response) => {
            if (response.data == 'Linked') {
              try{
                const BackWSSURL = window.location.origin.replace(/http/, "ws").replace(/:[0-9]+/,':9995') + "?containerId=" + this.containerId;
                const connectionToBackWSS = new WebSocket(BackWSSURL) // Front -> Back

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