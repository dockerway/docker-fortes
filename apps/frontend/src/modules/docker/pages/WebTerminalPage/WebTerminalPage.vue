<template>
  <v-container>
    <WebTerminal
      :taskId="taskId"
      :terminalSelected="terminal"
    />
  </v-container>
</template>

<script>
import WebTerminal from "@/modules/docker/components/WebTerminal/WebTerminal";

export default {
  name: "WebTerminalPage",
  components: { WebTerminal },
  computed: {
    taskId() {
      return this.$route.params.taskId
    },
    terminal() {
      return this.$route.params.terminal
    }
  },
}
</script>
