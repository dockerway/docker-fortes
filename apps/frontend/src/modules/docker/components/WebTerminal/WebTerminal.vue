<template>

  <main>
    <h1>Web terminal</h1>

    <div ref="mainDiv"></div>
  </main>
</template>

<script>
import { Terminal } from 'xterm';

import { AttachAddon } from 'xterm-addon-attach';
import { FitAddon } from 'xterm-addon-fit';

  const ws = new WebSocket('ws://localhost:3000'); //esto se ejecuta antes de lo que se inicia el server de wss
  const term = new Terminal();


  const attachAddon = new AttachAddon(ws);
  const fitAddon = new FitAddon();

  term.loadAddon(attachAddon);
  term.loadAddon(fitAddon);
  fitAddon.fit();

  export default {
    name: "DockerInfo",
    mounted(){
      term.open(this.$refs.mainDiv);
    },
  };
  
</script>

<style scoped>
</style>