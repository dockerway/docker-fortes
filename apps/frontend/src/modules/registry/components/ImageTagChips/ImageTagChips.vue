<template>
  <v-chip-group column >
    <v-chip v-for="item in items" :key="item" small>
      <span>{{item}}</span>
    </v-chip>
  </v-chip-group>

</template>

<script>

import {InputErrorsByProps, RequiredRule} from '@dracul/common-frontend'


import RegistryProvider from "../../providers/ImageProvider"

export default {
  name: "ImageTagChips",
  mixins: [InputErrorsByProps, RequiredRule],
  props:{
    name: {type: String, required: true},
    value: {type: [String, Array]},
    multiple: {type:Boolean, default: false },
    solo: {type:Boolean, default: false},
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
      RegistryProvider.imageTags(this.name).then(r => {
        this.items = r.data.imageTags.tags
      }).catch(err => console.error(err))
          .finally(()=> this.loading = false)
    }

  }
}
</script>

<style scoped>

</style>
