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
        <td>
          <v-chip small class="font-weight-bold" dark :color="getStateColor(task.state)">
            {{ task.state }}
          </v-chip>
        </td>
        <td>{{ formatDate(task.createdAt) }}</td>
        <td>{{ formatDate(task.updatedAt) }}</td>
        <td>{{ task.node ? task.node.hostname : task.nodeId }}</td>
        <td>{{ task.id }}</td>
        <td>
          <v-btn icon @click="showLogs(task)" color="blue">
            <v-icon small>description</v-icon>
          </v-btn>
          <v-btn v-if="task.state == 'running'" @click="showTerminalDialog=true" icon color="blue" class="ml-1">
            <v-icon small>terminal</v-icon>
            <ConfirmSelectDialog
              fullscreen
              v-model="showTerminalDialog"
              @close="closeTerminalDialog"
              @confirmed="(terminalSelected) => {openTerminal(terminalSelected, task)}"
              title="Ejecutar consola"
              defaultSelection="bash"
              :options="['bash','sh']"
            ></ConfirmSelectDialog>
          </v-btn>


        </td>
      </tr>
      </tbody>
    </v-simple-table>
  </div>
</template>

<script>
import {ConfirmSelectDialog} from "@dracul/common-frontend";
import {Dayjs} from "@dracul/dayjs-frontend";

export default {
  name: "ServiceTasks",
  props: {
    tasks: {type: Array},
    loading: {type: Boolean, default: false},
    service: {type: Object}
  },
  data(){
    return {
      showTerminalDialog : false,
    }
  },
  components: {ConfirmSelectDialog},
  methods: {
    showLogs(task) {
      this.$emit('showLogs', task)
    },

    getTerminalURL(terminalSelected, task){
      const stringTask = JSON.stringify(task);
      const stringService = JSON.stringify(this.service);

      return `/docker/terminal/${window.btoa(stringTask)}/${window.btoa(stringService)}/${window.btoa(terminalSelected)}`
    },

    openTerminal(terminalSelected, task){
      window.open(this.getTerminalURL(terminalSelected, task), '_blank')
    },
    closeTerminalDialog(){
      this.showTerminalDialog = false;
    },

  },
  computed: {
    formatDate() {
      return date => {
        return Dayjs(date).format("YYYY-MM-DD HH:mm:ss")
      }
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
