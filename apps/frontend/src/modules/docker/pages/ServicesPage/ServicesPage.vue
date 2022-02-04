<template>
  <v-task>


    <v-card class="my-3">
      <v-card-text class="py-0">
        <v-row align="center">
          <v-col cols="12" sm="9" md="9">
            <h4 class="text-h4 mb-4">Services</h4>
          </v-col>
          <v-col cols="12" sm="4" md="3">
            <stack-combobox v-model="stack"
                            @input="fetchService"
                            clearable
            />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <v-card>
      <v-card-text>
        <v-data-table
            :items="services"
            :headers="headers"
            :items-per-page.sync="itemsPerPage"
            :footer-props="{ itemsPerPageOptions: [5, 10, 25, 50, 100] }"
            :single-expand="singleExpand"
            :expanded.sync="expanded"
            @item-expanded="fetchTask"
            show-expand
            :loading="loading"
        >


          <template v-slot:item.name="{ item }">
            {{ item.name.replace(item.stack + "_", "") }}
          </template>


          <template v-slot:item.ports="{ item }">
            <v-chip small v-for="(port,index) in item.ports" :key="index">{{ port.publishedPort }}:{{ port.targetPort }}
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
                  {{ item.image.name }}
                </v-chip>
              </template>
              <span> {{ item.image.fullname }} </span>
            </v-tooltip>

          </template>

          <template v-slot:item.createdAt="{ item }">
            <v-chip small color="blue lighten-4">{{ formatDate(item.createdAt) }}</v-chip>
          </template>

          <template v-slot:item.updatedAt="{ item }">
            <v-chip small color="purple lighten-4">{{ formatDate(item.updatedAt) }}</v-chip>
          </template>

          <template v-slot:item.logs="{ item }">
            <v-btn icon @click="showLogs(item)">
              <v-icon>description</v-icon>
            </v-btn>
          </template>


          <template v-slot:expanded-item="{ headers, item }">
            <td :colspan="headers.length">

              <v-card v-if="loadingTask">
                <loading></loading>
              </v-card>

              <v-card v-else-if="item.tasks && item.tasks.length > 0" class="ma-3">
                <v-card-text>
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
                    <tr v-for="task in item.tasks" :key="task.id">
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


    <simple-dialog v-if="logs.show"
                   v-model="logs.show"
                   @close="closeLogs"
                   :title="'Logs '+ logs.service.name"

                   fullscreen
    >
      <v-row align="center">
        <v-col cols="12" sm="3">
          <v-switch
              label="AutoRefresh"
              v-model="logs.refresh"
              @change="showLogs(logs.service)"
          ></v-switch>
        </v-col>
        <v-col cols="12" sm="6">
          <v-slider
              v-model="logs.rate"
              :min="5" :max="60"
              label="Regresh Rate"
              thumb-color="green"
              thumb-label="always"
          ></v-slider>
        </v-col>
      </v-row>


      <v-data-table
          :items="logs.data"
          :headers="[{text:'timestamp',value:'timestamp'},{text:'text',value:'text'} ]"
          :items-per-page="100"
          hide-default-footer
          :loading="logs.loading"
      >
        <template v-slot:item.timestamp="{item}">
          {{ formatDate(item.timestamp) }}
        </template>
      </v-data-table>

    </simple-dialog>

  </v-task>
</template>

<script>
import DockerProvider from "@/modules/docker/providers/DockerProvider";
import StackCombobox from "@/modules/docker/compontents/StackCombobox/StackCombobox";
import {Dayjs} from "@dracul/dayjs-frontend"
import {SimpleDialog, Loading} from "@dracul/common-frontend"

export default {
  name: "ServicesPage",
  components: {StackCombobox, SimpleDialog,Loading},
  data() {
    return {
      services: [],
      itemsPerPage: 25,
      stack: null,
      loading: false,
      loadingTask: false,
      logs: {
        show: false,
        refresh: false,
        rate: 10,
        loading: false,
        service: null,
        data: []
      },

      expanded: [],
      singleExpand: false,

      nodes: []

    }
  },
  computed: {
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
    headers() {
      return [
        //Entity Headers
        {text: this.$t('docker.stack.name'), value: 'stack'},
        {text: this.$t('docker.service.name'), value: 'name'},
        {text: this.$t('docker.service.image'), value: 'image'},
        {text: this.$t('docker.common.createdAt'), value: 'createdAt'},
        {text: this.$t('docker.common.updatedAt'), value: 'updatedAt'},
        {text: this.$t('docker.service.ports'), value: 'ports'},
        //Actions
        {text: this.$t('docker.common.logs'), value: 'logs', sortable: false},
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
      DockerProvider.fetchService(this.stack)
          .then(r => {
            this.services = r.data.fetchService
          })
          .finally(() => this.loading = false)
    },
    fetchTask(input) {
      this.loadingTask = true
      DockerProvider.fetchTask(input.item.name)
          .then(r => {
            let tasks = r.data.fetchTask
            this.$set(input.item, 'tasks', tasks)

            for (let task of tasks) {
              this.findNode(task, task.nodeId)
            }

          })
          .finally(() => this.loadingTask = false)
    },
    findNode(task, nodeId) {
      console.log("NodeId", nodeId)
      let node = this.nodes.find(n => n.id === nodeId)
      if (node) {
        this.$set(task, 'node', node)
      }

      DockerProvider.findNode(nodeId).then(r => {
        let node = r.data.findNode
        this.nodes.push(node)
        this.$set(task, 'node', node)
      })
    },
    fetchLogs(serviceId) {
      this.logs.loading = true
      DockerProvider.serviceLogs(serviceId)
          .then(r => {
            this.logs.data = r.data.serviceLogs
            this.refreshLogs(serviceId)
          }).finally(() => this.logs.loading = false)
    },
    refreshLogs(serviceId) {
      if (this.logs.show && this.logs.refresh) {
        setTimeout(() => this.fetchLogs(serviceId), (this.logs.rate * 1000))
      }
    },
    showLogs(service) {
      this.logs.show = true
      this.logs.service = service
      this.fetchLogs(this.logs.service.id)
    },
    closeLogs() {
      this.logs.show = false
      this.logs.service = null
    }
  }
}
</script>

<style scoped>
pre {
  white-space: pre-wrap; /* Since CSS 2.1 */
  white-space: -moz-pre-wrap; /* Mozilla, since 1999 */
  white-space: -pre-wrap; /* Opera 4-6 */
  white-space: -o-pre-wrap; /* Opera 7 */
  word-wrap: break-word; /* Internet Explorer 5.5+ */
}
</style>
