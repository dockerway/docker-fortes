<template>
  <v-autocomplete
      prepend-icon="tag"
      :items="items"
      :item-text="'name'"
      :item-value="'name'"
      v-model="item"
      label="Tags"
      :loading="loading"
      color="secondary"
      item-color="secondary"
      :rules="isRequired ? required : []"
      :multiple="multiple"
      :chips="chips"
      :solo="solo"
      :disabled="disabled"
      :readonly="readonly"
      :clearable="clearable"
      :outlined="outlined"
      :hide-details="hideDetails"
  ></v-autocomplete>

</template>

<script>

import {InputErrorsByProps, RequiredRule} from '@dracul/common-frontend'


import GitlabProvider from "../../providers/GitlabProvider"

export default {
  name: "ProjectTagCombobox",
  mixins: [InputErrorsByProps, RequiredRule],
  props:{
    id: {type: Number, required: true},
    value: {type: [String, Array]},
    multiple: {type:Boolean, default: false },
    solo: {type:Boolean, default: false},
    outlined: {type:Boolean, default: false},
    hideDetails: {type:Boolean, default: false},
    chips: {type:Boolean, default: false},
    readonly: {type:Boolean, default:false},
    disabled: {type:Boolean, default: false},
    isRequired: {type:Boolean, default: false },
    clearable: {type:Boolean, default: false},
  },
  data() {
    return {
      items: [],
      loading: false
    }
  },
  computed: {
    item: {
      get() { return this.value },
      set(val) {this.$emit('input', val)}
    }
  },
  mounted() {
    this.fetch()
  },
  methods: {
    validate(){
      return this.$refs.form.validate()
    },
    fetch(){
      this.loading= true
      GitlabProvider.projectTags(this.id).then(r => {
        this.items = r.data.projectTags
      }).catch(err => console.error(err))
          .finally(()=> this.loading = false)
    }

  }
}
</script>

<style scoped>

</style>
