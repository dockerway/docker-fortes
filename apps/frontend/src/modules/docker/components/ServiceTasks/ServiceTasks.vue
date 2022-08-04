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
          <v-btn icon @click="showLogs(task)" @close="closeLogs()" color="blue">
            <v-icon small>description</v-icon>
          </v-btn>
          <v-btn v-if="task.state == 'running'" icon  :href="'/docker/terminal/'+task.nodeId+'/'+task.containerId" target="_blank"  color="blue" class="ml-1">
            <v-icon small>terminal</v-icon>
          </v-btn>
        </td>
      </tr>
      </tbody>
    </v-simple-table>
  </div>
</template>

<script>
import {Dayjs} from "@dracul/dayjs-frontend";

export default {
  name: "ServiceTasks",
  props: {
    tasks: {type: Array},
    loading: {type: Boolean, default: false},
  },
  methods: {
    showLogs(task) {
      this.$emit('showLogs', task)
    },
    closeLogs() {
      this.$emit('closeLogs')
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
