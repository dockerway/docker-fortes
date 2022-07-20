<template>
  <main>
    <div ref="mainDiv"></div>
  </main>
</template>

<script>
import { Terminal } from 'xterm';

import { AttachAddon } from 'xterm-addon-attach';
import { FitAddon } from 'xterm-addon-fit';

  let term = new Terminal();
  let attachAddon;

  const fitAddon = new FitAddon();
  fitAddon.activate(term);
  term.loadAddon(fitAddon);

  export default {
    name: "DockerInfo",
    props:['webSocket'],
    mounted(){
      term.open(this.$refs.mainDiv);
      console.log(`From MOUNTED webterm ${this.webSocket.url}`);
      attachAddon = new AttachAddon(this.webSocket);
      term.loadAddon(attachAddon);
    },
    watch:{
      webSocket: function(){
        console.log(`From WATCHER webterm ${this.webSocket.url}`);
        
        term.clear();
        attachAddon = new AttachAddon(this.webSocket);
        term.reset();

        term.loadAddon(attachAddon);
      }
    }
  };

</script>

<style scoped>
</style>