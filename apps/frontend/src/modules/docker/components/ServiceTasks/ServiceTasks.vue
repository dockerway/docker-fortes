<template>
  <div>
    <v-simple-table dense>
      <thead>
        <tr>
          <th>State</th>
          <th>Created</th>
          <th>Updated</th>
          <th>Node</th>
          <th>Task</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="task in tasks" :key="task.id">
          <td>{{ formatDate(task.createdAt) }}</td>
          <td>{{ formatDate(task.updatedAt) }}</td>
          <td>{{ task.node ? task.node.hostname : task.nodeId }}</td>
          <td>{{ task.id }}</td>
          <td>
            <v-btn icon @click="showLogs(task)" color="blue">
              <v-icon small>description</v-icon>
            </v-btn>
            <v-chip small class="font-weight-bold" dark :color="getStateColor(task.state)">
              {{ task.state }}
            </v-chip>

            <div v-if="task.state == 'running'">
              <v-btn  @click="showTerminal(task)" icon color="blue" class="ml-1">
                <v-icon>terminal</v-icon>
              </v-btn>

              <simple-dialog v-if="terminalHasToBeRendered"
                v-model="terminalHasToBeRendered"
                @close="closeTerminal"
                title='Terminal'
                fullscreen
              >
                <WebTerminal :webSocket="webSocket" v-if="webSocket !== null && terminalHasToBeRendered"/>
              </simple-dialog>
            </div>
          </td>
        </tr>
      </tbody>
  </v-simple-table>
</template>

<script>
import {Dayjs} from "@dracul/dayjs-frontend";
import {SimpleDialog} from "@dracul/common-frontend";
import WebTerminal from "@/modules/docker/components/WebTerminal/WebTerminal";

export default {
  name: "ServiceTasks",
  props: {
    tasks: {type: Array},
    loading: {type: Boolean, default: false},
  },
  data() {
    return {
      terminalHasToBeRendered: false,
      webSocket: null
    }
  },
  components:{SimpleDialog, WebTerminal},
  methods:{
    async showTerminal(task) {
      const axios = require("axios");

      axios.get(`/api/docker/task/${task.nodeId}/${task.containerId}/runTerminal/bash`)
        .then( (response) => {
          if (response.data == 'Linked'){
            const connectionToBackWSS = new WebSocket('ws://127.0.0.1:9995');
            this.webSocket = connectionToBackWSS;
          }
        });

      this.terminalHasToBeRendered = true;
    },

    async closeTerminal(){
      await this.webSocket.close();
      this.terminalHasToBeRendered = false;
    }
  },
  methods: {
    showLogs(task) {
      this.$emit('showLogs',task)
    },
  },
  computed: {
    formatDate() {
      return date => {
        return Dayjs(date).format("YYYY-MM-DD HH:mm:ss");
      };
    },
    getStateColor() {
      return state => {
        switch (state) {
          case 'running':
            return 'green darken-3'
          case 'rejected':
            return 'red darken-3'
          case 'shutdown':
            return 'red darken-3'
          case 'failed':
            return 'red darken-3'
          case 'starting':
            return 'teal darken-3'
          case 'complete':
            return 'blue darken-3'
          case 'restarting':
            return 'yellow darken-3'
          case 'paused':
            return 'cyan darken-3'
          case 'exited':
            return 'purple darken-3'
          case 'dead':
            return 'black darken-3'
          case 'created':
            return 'indigo darken-3'
          default:
            return 'grey darken-3'
        }
      };
    },
  }
}
</script>

<style scoped>

</style>