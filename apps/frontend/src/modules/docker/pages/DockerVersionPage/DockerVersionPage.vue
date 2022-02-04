<template>
  <v-container>
  version: {{version}}
  </v-container>
</template>

<script>
import DockerProvider from "@/modules/docker/providers/DockerProvider";

export default {
  name: "DockerVersionPage",
  data(){
    return {
      version: null
    }
  },
  created() {
    this.fetchVersion()
  },
  methods: {
    fetchVersion(){
      DockerProvider.dockerVersion().then(r=> {
        this.version = r.data.dockerVersion
      })
    }
  }
}
</script>

<style scoped>

</style>
