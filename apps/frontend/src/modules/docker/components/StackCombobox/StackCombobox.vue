<template>
  <v-autocomplete
      :items="stacks"
      :item-text="'name'"
      :item-value="'name'"
      :loading="loading"
      label="Stacks"
      v-model="stack"
      hide-details
      outlined dense
      :clearable="clearable"
  />

</template>

<script>
import DockerProvider from "@/modules/docker/providers/DockerProvider";

export default {
  name: "StackCombobox",
  props: {
    value: String,
    clearable: {type: Boolean, default: false}
  },
  computed: {
    stack: {
      get(){
        return this.value
      },
      set(val){
        this.$emit('input',val)
      }
    }
  },
  data() {
    return {
      stacks: [],
      loading: false
    }
  },
  created() {
    this.fetchStack()
  },
  methods: {
    fetchStack() {
      this.loading = true
      DockerProvider.fetchStack()
          .then(r => {
            this.stacks = r.data.fetchStack.sort((a, b) => a.name.localeCompare(b.name))
          })
          .finally(() => this.loading = false)
    }
  }
}
</script>

<style scoped>

</style>
