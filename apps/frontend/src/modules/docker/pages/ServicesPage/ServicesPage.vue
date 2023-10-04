<template>
  <v-container fluid>


    <v-card class="my-3">
      <v-card-text class="py-0">
        <v-row align="center">
          <v-col cols="12" sm="3" md="2">
            <h4 class="text-h4 mb-4">Services</h4>
          </v-col>
          <v-col cols="12" sm="3" md="3" class="text-right">
            <v-btn  class="purple mr-2" dark @click="fetchService"><v-icon>refresh</v-icon></v-btn>

            <v-btn class="blue mr-2" dark
                   @click="confirmRestartMany"
            >
              Restart
            </v-btn>

            <v-btn class="red" dark
                   @click="confirmRemoveMany">
              Remove
            </v-btn>
          </v-col>
          <v-col cols="12" sm="3" md="2">
            <stack-combobox v-model="stack"
                            @input="fetchService"
                            clearable
            />
          </v-col>
          <v-col cols="12" sm="3" md="3">
            <v-text-field v-model="serviceNameSearch" label="ServiceName"></v-text-field>
          </v-col>
          <v-col cols="12" sm="3" md="2">
            <v-text-field v-model="portSearch" label="Port"></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <v-card>
      <v-card-text>
        <v-data-table
            :items="getServices"
            :headers="headers"
            :items-per-page.sync="itemsPerPage"
            :footer-props="{ itemsPerPageOptions: [5, 10, 25, 50, 100] }"
            :single-expand="singleExpand"
            :expanded.sync="expanded"
            @item-expanded="expandTasks"
            show-select show-expand
            :loading="loading"
            v-model="selected"
            dense
        >


          <template v-slot:item.name="{ item }">
            <span class="font-weight-medium">{{ item.name }}</span>
          </template>


          <template v-slot:item.ports="{ item }">
            <v-chip small v-for="(port,index) in item.ports" :key="index">{{ port.hostPort }}:{{ port.containerPort }}
            </v-chip>
          </template>

          <template v-slot:item.image="{ item }">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-chip
                    v-bind="attrs"
                    v-on="on"
                    small
                >
                  {{ item.image.nameWithTag }}
                </v-chip>
              </template>
              <span> {{ item.image.fullname }} </span>
            </v-tooltip>

          </template>

          <template v-slot:item.createdAt="{ item }">
            <v-chip small color="blue lighten-4">{{ formatDate(item.createdAt) }}</v-chip><br>
            <v-chip small color="purple lighten-4">{{ formatDate(item.updatedAt) }}</v-chip>
          </template>

          <template v-slot:item.actions="{ item }">
            <v-btn icon @click="restart(item)" color="purple">
              <v-icon>restart_alt</v-icon>
            </v-btn>

            <v-btn icon @click="remove(item)" color="red">
              <v-icon>delete</v-icon>
            </v-btn>
          </template>


          <template v-slot:expanded-item="{ headers, item }">
            <td :colspan="headers.length">

              <v-card v-if="loadingTask">
                <loading></loading>
              </v-card>

              <v-card v-else-if="item.tasks && item.tasks.length > 0" class="ma-3">
                <v-card-text>
                  <v-btn icon absolute right top small @click="fetchTask(item)"><v-icon>refresh</v-icon></v-btn>
                  <service-tasks @showLogs="showTaskLogs" @closeLogs="closeTaskLogs" @showInspect="showTaskInspect" :tasks="item.tasks" :service="item"></service-tasks>
                </v-card-text>
              </v-card>

              <v-card v-else class="ma-3">
                <v-card-text>
                  <v-alert type="info">Sin datos</v-alert>
                </v-card-text>
              </v-card>

            </td>
          </template>

        </v-data-table>
      </v-card-text>
    </v-card>

    <confirm-dialog
        v-if="confirm.show"
        v-model="confirm.show"
        :title="confirm.title"
        :description="confirm.description"
        @confirmed="confirm.action"
    />

    <simple-dialog
          fullscreen
          v-model="logs.show"
          @close="closeTaskLogs"
          :title="`${currentLogsServiceName}.${logs.task? logs.task.id : null}`"
          style="background-color: white; width: 800px; max-height: 100vh;"
      >
      <log-visualizer v-if="logs.task && logs.tail" :task="logs.task" :tail="parseInt(logs.tail)"></log-visualizer>
    </simple-dialog>

    <simple-dialog
          fullscreen
          v-model="inspect.show"
          @close="closeTaskInspect"
          title="Service task inspect"
          style="background-color: white; width: 800px;"
      >
      <service-task-inspect v-if="inspect.task" :taskID="inspect.task.id"/>
    </simple-dialog>

  </v-container>
</template>

<script>
import DockerProvider from "@/modules/docker/providers/DockerProvider"
import StackCombobox from "@/modules/docker/components/StackCombobox/StackCombobox"
import {Dayjs} from "@dracul/dayjs-frontend"
import {SimpleDialog, Loading, ConfirmDialog} from "@dracul/common-frontend"
import {ServiceTasks, ServiceTaskInspect} from "@/modules/docker/components/ServiceTasks/"
import LogVisualizer from "../../components/LogVisualizer/LogVisualizer.vue"
import { mapActions } from 'vuex';

export default {
  name: "ServicesPage",

  components: { ServiceTasks, StackCombobox, SimpleDialog, Loading, ConfirmDialog, ServiceTaskInspect, LogVisualizer },
  data() {
    return {
      portSearch: '',
      services: [],
      selected: [],
      itemsPerPage: 25,
      stack: null,
      loading: false,
      loadingTask: false,

      logs: {
        show: false,
        task: null,
        tail: null
      },

      inspect: {
        show: false,
        task: null,
      },

      expanded: [],
      singleExpand: false,

      nodes: [],

      serviceNameSearch: '',

      confirm: {
        show: false,
        title: '',
        description: '',
        action: null
      },
      currentLogsServiceName : ''
    }
  },
  computed: {
    getServices() {
      return this.services.filter(service => {

        if(!service.name.toLowerCase().includes(this.serviceNameSearch.toLowerCase())) return false
        
        if(this.portSearch && this.portSearch != null){
          if(service.ports === null) return false
          return `${service.ports[0].hostPort}`.includes(this.portSearch) || `${service.ports[0].containerPort}`.includes(this.portSearch)
        }
        
        if(service.name.toLowerCase().includes(this.serviceNameSearch.toLowerCase())){
          if(this.portSearch && this.portSearch != null){
            if(service.ports === null) return false
            return `${service.ports[0].hostPort}`.includes(this.portSearch) || `${service.ports[0].containerPort}`.includes(this.portSearch)
          }
          return true
        }

      })
    },
    formatDate() {
      return date => {
        return Dayjs(date).format("YYYY-MM-DD HH:mm:ss")
      }
    },
    formatDateUnix() {
      return date => {
        return Dayjs.unix(date).format("YYYY-MM-DD HH:mm:ss");
      }
    },
    paramStack() {
      return this.$route.params.stack
    },
    headers() {
      return [
        //Entity Headers
        {text: this.$t('docker.service.name'), value: 'name'},
        {text: this.$t('docker.stack.name'), value: 'stack'},
        {text: this.$t('docker.service.image'), value: 'image', align: 'center'},
        {text: this.$t('docker.service.ports'), value: 'ports', align: 'center'},
        {text: this.$t('docker.common.createdAt')+"-"+this.$t('docker.common.updatedAt'), value: 'createdAt', align: 'center'},
       // {text: this.$t('docker.common.updatedAt'), value: 'updatedAt'},
        //Actions
      //  {text: this.$t('common.actions'), value: 'actions', sortable: false},
      ]
    },
  },
  async created() {
    this.stack = this.paramStack
    await this.fetchService()
    await this.loadSettingsAndSetLimitLogLines()
  },
  methods: {
    ...mapActions(['loadSettings']),

    async fetchService() {
      try {
        this.loading = true

        this.selected = []
        this.services = (await DockerProvider.fetchService(this.stack)).data.fetchService
      } catch (error) {
        console.log(`An error happened at the fetchService method: '${error.message}'`)
        throw error
      }finally{
        this.loading = false
      }


    },
    async expandTasks(input){
      try {
        await this.fetchTask(input.item)
      } catch (error) {
        console.log(`An error happened at the expandTasks method: '${error.message}'`)
        throw error
      }
    },
    async fetchTask(service) {
      try {
        this.loadingTask = true
        
        const serviceTasks = (await DockerProvider.fetchTask(service.name)).data.fetchTask
        this.$set(service, 'tasks', serviceTasks)

        for (let task of serviceTasks) {
          await this.findNode(task, task.nodeId)
        }
      } catch (error) {
        console.log(`An error happened at the fetchTask method: '${error.message}'`)
        throw error
      }finally{
        this.loadingTask = false
      }
    },
    async findNode(task, nodeId) {
      try {
        let node = this.nodes.find(n => n.id === nodeId)
        if (node) this.$set(task, 'node', node)

        node = (await DockerProvider.findNode(nodeId)).data.findNode

        this.nodes.push(node)
        this.$set(task, 'node', node)
      } catch (error) {
        console.log(`An error happened at the findNode method: '${error.message}'`)
        throw error
      }

    },
    async showTaskLogs(task) {
      try {
        await this.setCurrentLogsServiceName(task)

        this.logs.show = true
        this.logs.task = task
      } catch (error) {
        console.log(`An error happened at the showTaskLogs method: '${error.message}'`)
        throw error
      }
    },

    async showTaskInspect(task) {
      try {
        this.inspect.show = true
        this.inspect.task = task
      } catch (error) {
        console.log(`An error happened at the showTaskInspect method: '${error.message}'`)
        throw error
      }
    },

    async setCurrentLogsServiceName(currentTask){
      try {
        this.currentLogsServiceName = (await DockerProvider.fetchServiceById(currentTask.serviceId)).data.findServiceById.name
        
      } catch (error) {
        console.log(`An error happened at the setCurrentLogsServiceName method: '${error.message}'`)
        throw error
      }
    },

    closeTaskLogs() {
      this.logs.show = false
      this.logs.task = null
    },
    closeTaskInspect() {
      this.inspect.show = false
      this.inspect.task = null
    },
    clearConfirm(){
      this.confirm.title = null;
      this.confirm.description = null;
      this.confirm.action = null;
      this.confirm.show = false;
    },
    confirmRestartMany(){
      this.confirm.title = "Restart Services"
      this.confirm.description = "Are you sure to restart the selected services?"
      this.confirm.action = this.restartMany
      this.confirm.show = true
    },
    confirmRemoveMany(){
      this.confirm.title = "Remove Services"
      this.confirm.description = "Are you sure to remove the selected services?"
      this.confirm.action = this.removeMany
      this.confirm.show = true
    },
    async restart(service) {
      await DockerProvider.dockerRestart(service.id)
      this.fetchTask(service)
    },
    async restartMany() {
      const serviceIds = this.selected.map(s => s.id)
      await DockerProvider.dockerRestartMany(serviceIds)

      for(let service of this.selected){
        await this.fetchTask(service)
      }
    },
    async remove(service) {
      await DockerProvider.dockerRemove(service.id)

      await this.fetchService()
    },
    async removeMany() {
      let serviceIds = this.selected.map(s => s.id)
      await DockerProvider.dockerRemoveMany(serviceIds)

      await this.fetchService()
    },
    async loadSettingsAndSetLimitLogLines() {
      try {
        const settings = await this.loadSettings()
        const { value: limitLogLines } = settings.find(setting => setting.key === 'maxLogsLines') || {}

        this.logs.tail = limitLogLines
      } catch (error) {
        console.error(`An error happened at the loadSettingsAndSetLimitLogLines method: ${error.message ? error.message : error}`)
      }
    },
  }
}
</script>

<style scoped>

.text-start{
  padding-left: 5px !important;
}

pre {
  white-space: pre-wrap; /* Since CSS 2.1 */
  white-space: -moz-pre-wrap; /* Mozilla, since 1999 */
  white-space: -pre-wrap; /* Opera 4-6 */
  white-space: -o-pre-wrap; /* Opera 7 */
  word-wrap: break-word; /* Internet Explorer 5.5+ */
}

.v-dialog--active{
  overflow: hidden !important; 
}
</style>
