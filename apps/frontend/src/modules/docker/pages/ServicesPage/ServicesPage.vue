<template>
  <v-container>


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
            @item-expanded="fetchContainer"
            show-expand
        >


          <template v-slot:item.name="{ item }">
            {{ item.name.replace(item.stack + "_", "") }}
          </template>


          <template v-slot:item.ports="{ item }">
            <v-chip v-for="(port,index) in item.ports" :key="index">{{ port.publishedPort }}/{{ port.targetPort }}
            </v-chip>
          </template>

          <template v-slot:item.image="{ item }">
            {{ item.image.split("@")[0] }}
          </template>

          <template v-slot:item.createdAt="{ item }">
            <v-chip color="blue lighten-4">{{ formatDate(item.createdAt) }}</v-chip>
          </template>

          <template v-slot:item.updatedAt="{ item }">
            <v-chip color="purple lighten-4">{{ formatDate(item.updatedAt) }}</v-chip>
          </template>

          <template v-slot:item.action="{ item }">
            <v-btn icon @click="showLogs(item)">
              <v-icon>description</v-icon>
            </v-btn>
          </template>


          <template v-slot:expanded-item="{ headers, item }">
            <td :colspan="headers.length">

              <v-card v-if="item.containers && item.containers.length > 0" class="ma-3">
                <v-card-text>
                  <v-simple-table dense>
                    <thead>
                    <tr>
                      <th>state</th>
                      <th>created</th>
                      <th>task</th>
                      <th>NodeId</th>
                    </tr>
                    </thead>

                    <tbody>
                    <tr v-for="container in item.containers" :key="container.id">
                      <td>
                        <v-chip small class="font-weight-bold" dark :color="getStateColor(container.state)">
                          {{ container.state }}
                        </v-chip>
                      </td>
                      <td>{{ formatDateUnix(container.createdAt) }}</td>
                      <td>{{ container.task }}</td>
                      <td>{{ container.nodeId }}</td>
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


    <simple-dialog v-if="logs.service"
                   v-model="logs.service"
                   @close="logs.service = null"
                   :title="'Logs '+ logs.service.name"
                   fullscreen
    >
      <v-row dense>
        <v-col cols="12" v-for="log in logs.data" :key="log.timestamp">
          <v-card rounded>
            <v-card-text>
              <v-row dense align="center">
                <v-col cols="2"> {{ formatDateUnix(log.timestamp) }}</v-col>
                <v-col cols="10"> {{ log.text }}</v-col>
              </v-row>

            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

    </simple-dialog>

  </v-container>
</template>

<script>
import DockerProvider from "@/modules/docker/providers/DockerProvider";
import StackCombobox from "@/modules/docker/compontents/StackCombobox/StackCombobox";
import {Dayjs} from "@dracul/dayjs-frontend"
import {SimpleDialog} from "@dracul/common-frontend"

export default {
  name: "ServicesPage",
  components: {StackCombobox, SimpleDialog},
  data() {
    return {
      services: [],
      itemsPerPage: 25,
      stack: null,

      logs: {
        service: null,
        data: null
      },

      expanded: [],
      singleExpand: false,

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
        {text: this.$t('common.actions'), value: 'action', sortable: false},
      ]
    },
  },
  created() {
    this.stack = this.paramStack
    this.fetchService()
  },
  methods: {
    fetchService() {
      DockerProvider.fetchService(this.stack).then(r => {
        this.services = r.data.fetchService
      })
    },
    fetchContainer(input) {
      console.log("fetchContainer service", input.item)
      let name = input.item.name.replace(input.item.stack + "_", "")
      console.log("fetchContainer name", name)
      DockerProvider.fetchContainer(name).then(r => {
        let containers = r.data.fetchContainer
        console.log("containers", containers)
        this.$set(input.item, 'containers', containers)
        //input.item.containers = containers
      })
    },
    fetchLogs(service) {
      DockerProvider.serviceLogs(service).then(r => {
        this.logs.data = r.data.serviceLogs
      })
    },
    showLogs(service) {
      this.logs.service = service
      this.fetchLogs(this.logs.service.id)
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
