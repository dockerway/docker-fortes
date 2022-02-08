<template>
  <v-simple-table dense>
    <thead>
    <tr>
      <th>state</th>
      <th>created</th>
      <th>updated</th>
      <th>Node</th>
      <th>task</th>
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

    </tr>
    </tbody>
  </v-simple-table>
</template>

<script>
import {Dayjs} from "@dracul/dayjs-frontend"

export default {
  name: "ServiceTasks",
  props: {
    tasks: {type: Array},
    loading: {type: Boolean, default: false}
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
      }
    },
  }
}
</script>

<style scoped>

</style>
