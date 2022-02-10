<template>
  <v-container>
    <h3>Images</h3>

    <v-data-table
        :items="images"
        :loading="loading"
        :headers="headers"
        :items-per-page="itemsPerPage"
        :footer-props="{ itemsPerPageOptions: [3, 5, 10, 25, 50] }"
    >

      <template v-slot:item.tags="{item}">
        <image-tag-chips :name="item.name"></image-tag-chips>
      </template>

      <template v-slot:item.tagscombo="{item}">
        <image-tag-combobox :name="item.name" hide-details ></image-tag-combobox>
      </template>

    </v-data-table>
  </v-container>
</template>

<script>
import RegistryProvider from "../../providers/RegistryProvider";
import ImageTagChips from "@/modules/registry/components/ImageTagChips/ImageTagChips";
import ImageTagCombobox from "@/modules/registry/components/ImageTagCombobox/ImageTagCombobox";

export default {
  name: "ImagePage",
  components: {ImageTagCombobox, ImageTagChips},
  data() {
    return {
      loading: false,
      itemsPerPage: 3,
      pageNumber: 1,
      totalItems: null,
      images: []
    }
  },
  computed: {
    headers() {
      return [
        {text: 'name',value:'name', width: '180px'},
        {text: 'tags',value:'tags'},
        {text: 'tagscombo',value:'tagscombo', width: '150px'},
      ]
    }
  },
  created() {
    this.fetch()
  },
  methods: {
    fetch() {
      this.loading = true
      RegistryProvider.fetchImage()
          .then(r => {
            this.images = r.data.fetchImage
         //   this.totalItems = r.data.fetchProject.length
          })
          .finally(() => this.loading = false)

    }
  }
}
</script>

<style scoped>

</style>
