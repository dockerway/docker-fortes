<template>
  <v-container>
    <WebTerminal :webSocket="webSocket" v-if="webSocket !== null && terminalHasToBeRendered"/>
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
      terminalHasToBeRendered: false,
      webSocket: null
    }
  },
  mounted() {

    this.showTerminal()
  },
  methods: {
    async showTerminal() {
      const axios = require("axios")

      axios.get(`/api/docker/task/${this.nodeId}/${this.containerId}/runTerminal/bash`)
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

      this.terminalHasToBeRendered = true
    },

    async closeTerminal() {
      await this.webSocket.close()
      this.terminalHasToBeRendered = false
    }
  }
}
</script>

<style scoped>

</style>
