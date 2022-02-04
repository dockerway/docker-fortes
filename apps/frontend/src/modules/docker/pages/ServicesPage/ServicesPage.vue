<template>
  <v-container>


    <v-card class="my-3" >
      <v-card-text class="py-0">
        <v-row align="center">
          <v-col cols="12" sm="9" md="9">
            <h4 class="text-h4 mb-4">Services</h4>
          </v-col>
          <v-col cols="12" sm="4" md="3">
            <stack-combobox v-model="stack" @input="fetchService"></stack-combobox>
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
            :footer-props="{ itemsPerPageOptions: [5, 10, 25, 50] }"
        ></v-data-table>
      </v-card-text>
    </v-card>


  </v-container>
</template>

<script>
import DockerProvider from "@/modules/docker/providers/DockerProvider";
import StackCombobox from "@/modules/docker/compontents/StackCombobox/StackCombobox";

export default {
  name: "ServicesPage",
  components: {StackCombobox},
  data() {
    return {
      services: [],
      itemsPerPage: 5,
      stack: null
    }
  },
  computed: {
    paramStack(){
      return this.$route.params.stack
    },
    headers() {
      return [
        //Entity Headers
        {text: this.$t('docker.service.name'), value: 'name'},
        {text: this.$t('docker.stack'), value: 'stack'},
        //Actions
        //{text: this.$t('common.actions'), value: 'action', sortable: false},
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
    }
  }
}
</script>

<style scoped>

</style>
