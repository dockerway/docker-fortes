<template>
  <v-container fluid>


    <v-card class="my-3">
      <v-card-text class="py-0">
        <v-row align="center">
          <v-col cols="12" sm="4" md="3">
            <h4 class="text-h4 mb-4">Services</h4>
          </v-col>
          <v-col cols="12" sm="4" md="3" class="text-right">
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
          <v-col cols="12" sm="4" md="3">
            <stack-combobox v-model="stack"
                            @input="fetchService"
                            clearable
            />
          </v-col>
          <v-col cols="12" sm="4" md="3">
            <v-text-field v-model="serviceNameSearch" label="ServiceName"></v-text-field>
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
            <span class="font-weight-medium">{{ item.name.replace(item.stack + "_", "") }}</span>
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




          <template v-slot:item.logs="{ item }">
            <v-btn icon @click="showLogs(item)" color="blue">
              <v-icon>description</v-icon>
            </v-btn>
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
                  <service-tasks @showLogs="showTaskLogs" :tasks="item.tasks"></service-tasks>
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


    <!-- <simple-dialog v-if="logs.show"
                   v-model="logs.show"
                   @close="closeLogs"
                   :title="'Logs '+ logs.service.name"

                   fullscreen
    >
      <service-log :service="this.logs.service"></service-log>

    </simple-dialog> -->


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
          @close="closeLogs"
          :title="'Logs '"
          style="background-color: white; width: 800px;"
      >
      <service-task-logs :task="this.logs.task"></service-task-logs>
    </simple-dialog>

  </v-container>
</template>

<script>
import DockerProvider from "@/modules/docker/providers/DockerProvider";
import StackCombobox from "@/modules/docker/components/StackCombobox/StackCombobox";
import {Dayjs} from "@dracul/dayjs-frontend"
import {SimpleDialog, Loading, ConfirmDialog} from "@dracul/common-frontend"
import ServiceLog from "@/modules/docker/components/ServiceLog/ServiceLog";
import ServiceTasks from "@/modules/docker/components/ServiceTasks/ServiceTasks";
import ServiceTaskLogs from "@/modules/docker/components/ServiceTasks/ServiceTaskLogs";

export default {
  name: "ServicesPage",
  
  components: {ServiceTasks, ServiceLog, StackCombobox, SimpleDialog, Loading, ConfirmDialog, ServiceTaskLogs},
  data() {
    return {
      services: [],
      selected: [],
      itemsPerPage: 25,
      stack: null,
      loading: false,
      loadingTask: false,

      logs: {
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
      }

    }
  },
  computed: {
    getServices() {
      return this.services.filter(s => s.name.includes(this.serviceNameSearch))
    },
    formatDate() {
      return date => {
        return Dayjs(date).format("YYYY-MM-DD HH:mm:ss")
      }
    },
    formatDateUnix() {
      return date => {
        console.log(date)
        return Dayjs.unix(date).format("YYYY-MM-DD HH:mm:ss")
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
        {text: this.$t('docker.common.logs'), value: 'logs', sortable: false},
      //  {text: this.$t('common.actions'), value: 'actions', sortable: false},
      ]
    },
  },
  created() {
    this.stack = this.paramStack
    this.fetchService()
  },
  methods: {
    fetchService() {
      this.loading = true
      this.selected = []
      DockerProvider.fetchService(this.stack)
          .then(r => {
            this.services = r.data.fetchService
          })
          .finally(() => this.loading = false)
    },
    expandTasks(input){
      this.fetchTask(input.item)
    },
    fetchTask(service) {
      this.loadingTask = true
      DockerProvider.fetchTask(service.name)
          .then(r => {
            let tasks = r.data.fetchTask
            this.$set(service, 'tasks', tasks)

            for (let task of tasks) {
              this.findNode(task, task.nodeId)
            }

          })
          .finally(() => this.loadingTask = false)
    },
    findNode(task, nodeId) {
      if(nodeId){
        let node = this.nodes.find(n => n.id === nodeId)
        if (node) {
          this.$set(task, 'node', node)
        }

        DockerProvider.findNode(nodeId).then(r => {
          let node = r.data.findNode
          this.nodes.push(node)
          this.$set(task, 'node', node)
        })
      }

    },
    showLogs(service) {
      this.logs.show = true
      this.logs.service = service
    },
    showTaskLogs(task) {
      this.logs.show = true
      this.logs.task = task
    },
    closeLogs() {
      this.logs.show = false
      this.logs.service = null
      this.logs.task = null
    },
    clearConfirm(){
      this.confirm.title = null
      this.confirm.description = null
      this.confirm.action = null
      this.confirm.show = false
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
    restart(service) {
      DockerProvider.dockerRestart(service.id)
          .then(r => {
            console.log("restart", r.data)
            this.fetchTask(service)
          })
    },
    restartMany() {
      let serviceIds = this.selected.map(s => s.id)
      DockerProvider.dockerRestartMany(serviceIds)
          .then(r => {
            console.log("restart many", r.data)
            for(let service of this.selected){
              this.fetchTask(service)
            }

          })
    },
    remove(service) {
      DockerProvider.dockerRemove(service.id)
          .then(r => {
            console.log("restart", r.data)
            this.fetchService()
          })
    },
    removeMany() {
      let serviceIds = this.selected.map(s => s.id)
      DockerProvider.dockerRemoveMany(serviceIds)
          .then(r => {
            console.log("restart", r.data)
            this.fetchService()
          })
    }
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
</style>
