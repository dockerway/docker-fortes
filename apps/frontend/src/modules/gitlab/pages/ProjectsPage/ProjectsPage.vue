<template>
  <v-container>
    <h3>Projects</h3>

    <v-data-table
    :items="projects"
    :loading="loading"
    :headers="headers"
    :page.sync="pageNumber"
    :items-per-page.sync="itemsPerPage"
    :server-items-length="totalItems"
    :footer-props="{ itemsPerPageOptions: [3, 5, 10, 25, 50] }"
    @update:page="fetch"
    @update:items-per-page="fetch"
    >

      <template v-slot:item.tags="{item}">
        <project-tag-chips :id="item.id"></project-tag-chips>
      </template>

    </v-data-table>
  </v-container>
</template>

<script>
import GitlabProvider from "@/modules/gitlab/providers/GitlabProvider";
import ProjectTagChips from "@/modules/gitlab/components/ProjectTagChips/ProjectTagChips";

export default {
  name: "ProjectPage",
  components: {ProjectTagChips},
  data() {
    return {
      loading: false,
      itemsPerPage: 3,
      pageNumber: 1,
      totalItems: null,
      projects: []
    }
  },
  computed: {
    headers() {
      return [
        {text: 'id',value:'id', width: '70px'},
        {text: 'namespace',value:'namespace.name', width: '150px'},
        {text: 'name',value:'name', width: '150px'},
        {text: 'tags',value:'tags'},
      ]
    }
  },
  created() {
    this.fetch()
  },
  methods: {
    fetch() {
      this.loading = true
      GitlabProvider.fetchProject(this.pageNumber, this.itemsPerPage)
          .then(r => {
            this.projects = r.data.fetchProject.items
            this.totalItems = r.data.fetchProject.totalItems
          })
          .finally(() => this.loading = false)

    }
  }
}
</script>

<style scoped>

</style>
