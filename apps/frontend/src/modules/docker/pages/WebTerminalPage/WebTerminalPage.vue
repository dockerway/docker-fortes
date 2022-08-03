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
    this.showTerminal();
  },
  beforeDestroy(){
    this.webSocket.close();
  },
  methods: {
    async showTerminal() {
      const axios = require("axios")

      const path = `/api/docker/task/${this.nodeId}/${this.containerId}/runTerminal/sh`
      const URL = process.env.VUE_APP_APIHOST ? process.env.VUE_APP_APIHOST + path : path;

      axios.get(URL) //Back -> Agent
          .then((response) => {
            if (response.data == 'Linked') {
              try{
                const BackWSSURL = window.location.origin.replace(/http/, "ws").replace(/:[0-9]+/,`:7000`);
                const connectionToBackWSS = new WebSocket(BackWSSURL) // Front -> Back
                connectionToBackWSS.randomID = Math.floor(Math.random() * 5000)

                this.webSocket = connectionToBackWSS
                console.log(this.webSocket)
              } catch (error){
                console.error(error)
              }
            }
          }).catch ((error) =>{
            console.error(error)
          })
    }
  }
}
</script>