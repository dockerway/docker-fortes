<template>
  <v-container>
    <h4 class="text-h4 mb-4">Stacks</h4>

    <v-card>
      <v-card-text>
        <v-data-table
            :items="stacks"
            :headers="headers"
            :items-per-page.sync="itemsPerPage"
            :footer-props="{ itemsPerPageOptions: [5, 10, 25, 50] }"
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
      itemsPerPage: 5,
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
