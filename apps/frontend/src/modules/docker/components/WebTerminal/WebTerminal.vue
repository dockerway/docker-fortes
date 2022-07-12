<template>
  <main>
    <div ref="mainDiv"></div>
  </main>
</template>

<script>
import { Terminal } from 'xterm';

import { AttachAddon } from 'xterm-addon-attach';
import { FitAddon } from 'xterm-addon-fit';

  const term = new Terminal();
  const fitAddon = new FitAddon();
  fitAddon.activate(term);
  term.loadAddon(fitAddon);

  export default {
    name: "DockerInfo",
    props:['webSocket'],
    mounted(){
      term.open(this.$refs.mainDiv);

      const attachAddon = new AttachAddon(this.webSocket);
      term.loadAddon(attachAddon);
    }
  };
  
</script>

<style scoped>
</style>