<template>
  <v-card outlined :dark="this.$vuetify.theme.dark">
    <v-card-title>{{ serviceNameAndStack ? serviceNameAndStack.name : null }}</v-card-title>
    <v-card-subtitle id="taskID">Task: {{ taskId }}</v-card-subtitle>

    <v-card-text>
      <div ref="mainDiv"></div>
    </v-card-text>
  </v-card>
</template>

<script>
import dockerProvider from '../../providers/DockerProvider';
import { WebTerminal } from './WebTerminalCreator.js';


export default {
  name: "WebTerminal",
  props: {
    taskId: {
      type: String,
      required: true
    },
  },
  data() {
    return {
      serviceNameAndStack: null,
      taskIds: {}
    }
  },
  async mounted() {
    await this.getServiceNameAndStack()
    const webterminal = new WebTerminal(this.$refs.mainDiv, this.taskIds)
    await webterminal.renderTerminal()
  },
  afterMount() {
    const xtermScreen = document.querySelector('.xterm-screen')
    xtermScreen.style += 'height: 70vh !important;'
  },
  methods: {
    async getTaskIds() {
      try {
        const taskIds = (await dockerProvider.findTaskIDs(this.taskId)).data.findTaskIDs
        return taskIds
      } catch (error) {
        console.error(`An error happened at the getTaskIds method: '${error}'`)
      }
    },

    async getServiceNameAndStack() {
      try {
        this.taskIds = await this.getTaskIds()

        const serviceId = this.taskIds.serviceId
        this.serviceNameAndStack = (await dockerProvider.fetchServiceNameAndStackById(serviceId)).data.findServiceById

        return this.serviceNameAndStack
      } catch (error) {
        console.error(`An error happened at the getServiceNameAndStack method: '${error}'`)
      }
    },
  }
}

</script>
