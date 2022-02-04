<template>
  <v-container>
    <v-card class="my-3" >
      <v-card-text class="py-0">
        <v-row align="center">
          <v-col cols="12" sm="9" md="9">
            <h4 class="text-h4 mb-4">Nodes</h4>
          </v-col>
          <v-col cols="12" sm="4" md="3">
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>


    <v-card>
      <v-card-text>
        <v-data-table
            dense
            :items="nodes"
            :headers="headers"
            :items-per-page.sync="itemsPerPage"
            :footer-props="{ itemsPerPageOptions: [5, 10, 25, 50,100] }"
        >

          <template v-slot:item.leader="{ item }">
            <v-icon :color="item.leader ? 'green' : 'grey'">
            {{item.leader ? 'done' : 'dangerous'}}
            </v-icon>
          </template>

    <!--
          <template v-slot:item.action="{ item }">
            <v-btn icon :to="{name: 'ServicesPage',params:{stack: item.name}}"><v-icon>list</v-icon></v-btn>
          </template>
     -->



        </v-data-table>
      </v-card-text>
    </v-card>


  </v-container>
</template>

<script>
import DockerProvider from "@/modules/docker/providers/DockerProvider";

export default {
  name: "NodesPage",
  data() {
    return {
      nodes: [],
      itemsPerPage: 25,
    }
  },
  computed: {
    headers() {
      return [
        //Entity Headers
        {text: this.$t('docker.node.id'), value: 'id'},
        {text: this.$t('docker.node.hostname'), value: 'hostname'},
        {text: this.$t('docker.node.ip'), value: 'ip'},
        {text: this.$t('docker.node.role'), value: 'role'},
        {text: this.$t('docker.node.state'), value: 'state'},
        {text: this.$t('docker.node.engine'), value: 'engine'},
        {text: this.$t('docker.node.leader'), value: 'leader'},
        {text: this.$t('docker.node.reachability'), value: 'reachability'},
        //Actions
       // {text: this.$t('common.actions'), value: 'action', sortable: false},
      ]
    },
  },
  created() {
    this.fetchNodes()
  },
  methods: {
    fetchNodes() {
      DockerProvider.fetchNode().then(r => {
        this.nodes = r.data.fetchNode
      })
    }
  }
}
</script>

<style scoped>

</style>
