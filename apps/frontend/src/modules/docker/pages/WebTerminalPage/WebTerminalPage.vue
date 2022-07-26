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
              const connectionToBackWSS = new WebSocket('ws://127.0.0.1:9995')
              this.webSocket = connectionToBackWSS
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
