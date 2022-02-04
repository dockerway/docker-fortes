<template>
  <v-container>
    <v-card class="my-3" >
      <v-card-text class="py-0">
        <v-row align="center">
          <v-col cols="12" sm="9" md="9">
            <h4 class="text-h4 mb-4">Stacks</h4>
          </v-col>
          <v-col cols="12" sm="4" md="3">
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>


    <v-card>
      <v-card-text>
        <v-data-table
            :items="stacks"
            :headers="headers"
            :items-per-page.sync="itemsPerPage"
            :footer-props="{ itemsPerPageOptions: [5, 10, 25, 50,100] }"
        >
          <template v-slot:item.action="{ item }">
            <v-btn icon :to="{name: 'ServicesPage',params:{stack: item.name}}"><v-icon>list</v-icon></v-btn>
          </template>



        </v-data-table>
      </v-card-text>
    </v-card>


  </v-container>
</template>

<script>
import DockerProvider from "@/modules/docker/providers/DockerProvider";

export default {
  name: "StacksPage",
  data() {
    return {
      stacks: [],
      itemsPerPage: 25,
    }
  },
  computed: {
    headers() {
      return [
        //Entity Headers
        {text: this.$t('docker.name'), value: 'name'},
        {text: this.$t('docker.services'), value: 'services'},
        //Actions
        {text: this.$t('common.actions'), value: 'action', sortable: false},
      ]
    },
  },
  created() {
    this.fetchStack()
  },
  methods: {
    fetchStack() {
      DockerProvider.fetchStack().then(r => {
        this.stacks = r.data.fetchStack
      })
    }
  }
}
</script>

<style scoped>

</style>
