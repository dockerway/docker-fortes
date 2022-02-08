<template>
<v-container>
  <v-row align="center">
    <v-col cols="12" sm="3">
      <v-switch
          label="AutoRefresh"
          v-model="refresh"
          @change="refreshLogs()"
      ></v-switch>
    </v-col>
    <v-col cols="12" sm="6">
      <v-slider
          v-model="refreshRate"
          :min="1" :max="60"
          label="Regresh Rate"
          thumb-color="green"
          thumb-label="always"
      ></v-slider>
    </v-col>
  </v-row>


  <v-data-table
      :items="data"
      :headers="[{text:'timestamp',value:'timestamp'},{text:'text',value:'text'} ]"
      :items-per-page="100"
      hide-default-footer
      :loading="loading"
  >
    <template v-slot:item.timestamp="{item}">
      {{ item.timestamp }}
    </template>
  </v-data-table>
</v-container>
</template>

<script>
import DockerProvider from "@/modules/docker/providers/DockerProvider";
import {Dayjs} from "@dracul/dayjs-frontend"
export default {
  name: "ServiceLog",
  props: {
    service: {type: Object}
  },
  data(){
    return {
    refresh: true,
    refreshRate: 5,
    loading: false,
    data: [],
      orderBy: 'timestamp'
    }
  },
  computed: {
    getServiceId(){
      return this.service.id
    },
    formatDate() {
      return date => {
        return Dayjs(date).format("YYYY-MM-DD HH:mm:ss")
      }
    },
  },
  created() {
    this.fetchLogs()
  },
  methods: {
    fetchLogs() {
      this.loading = true
      DockerProvider.serviceLogs(this.getServiceId)
          .then(r => {
            this.data =  []
            this.data = r.data.serviceLogs
            this.refreshLogs()
          }).finally(() => this.loading = false)
    },
    refreshLogs() {
      if (this.refresh) {
        setTimeout(() => this.fetchLogs(), (this.refreshRate * 1000))
      }
    },

  }
}
</script>

<style scoped>

</style>
