<template>
  <v-container ref="container">
    <json-viewer v-if="inspect" :value="JSON.parse(inspect)" theme="jsonviewer"></json-viewer>
  </v-container>
</template>

<script>
import DockerProvider from "@/modules/docker/providers/DockerProvider";
import JsonViewer from 'vue-json-viewer';

export default {
  name: "ServiceTaskInspect",
  props: {
    taskID: { required: true, type: String },
  },
  components: {
    JsonViewer
  },
  data() {
    return {
      inspect: null
    }
  },
  methods: {
    async inspectTask() {
      const { data } = await DockerProvider.fetchTaskInspect(this.taskID);
      this.inspect = data.fetchTaskInspect
    },
  },
  mounted() {
    this.inspectTask()
  },
};
</script>

<style lang="scss">
// values are default one from jv-light template
.jsonviewer {
  background: #272727;
  white-space: nowrap;
  color: #ffffff;
  font-size: 14px;
  font-family: Consolas, Menlo, Courier, monospace;

  .jv-ellipsis {
    color: #4d4d4d;
    background-color: #eee;
    display: inline-block;
    line-height: 0.9;
    font-size: 0.9em;
    padding: 0px 4px 2px 4px;
    border-radius: 3px;
    vertical-align: 2px;
    cursor: pointer;
    user-select: none;
  }
  .jv-button { color: #49b3ff }
  .jv-key { color: #ffffff }
  .jv-item {
    &.jv-array { color: #ffffff }
    &.jv-boolean { color: #ff2f7b }
    &.jv-function { color: #067bca }
    &.jv-number { color: #ff2f7b }
    &.jv-number-float { color: #ff2f7b }
    &.jv-number-integer { color: #ff2f7b }
    &.jv-object { color: #ffffff }
    &.jv-undefined { color: #ff902e }
    &.jv-string {
      color: #42b983;
      word-break: break-word;
      white-space: normal;
    }
  }
  .jv-code {
    .jv-toggle {
      &:before {
        padding: 0px 2px;
        border-radius: 2px;
      }
      &:hover {
        &:before {
          background: #eee;
        }
      }
    }
  }
}
</style>