<template>
  <main>
    <div ref="mainDiv" id="mainDiv"></div>
  </main>
</template>

<script>
import { Terminal } from 'xterm';

import { AttachAddon } from 'xterm-addon-attach';
import { FitAddon } from 'xterm-addon-fit';

  let term = new Terminal();
  let attachAddon;

  const fitAddon = new FitAddon();
  term.loadAddon(fitAddon);
  fitAddon.activate(term);
  fitAddon.fit();
  const resizeObserver = new ResizeObserver(() => fitAddon.fit());


  export default {
    name: "DockerInfo",
    props:['webSocket'],
    mounted(){
      resizeObserver.observe(this.$refs.mainDiv);

      term.clear();
      term.reset();

      term.open(this.$refs.mainDiv);

      attachAddon = new AttachAddon(this.webSocket);
      term.loadAddon(fitAddon);

      fitAddon.fit();
      term.loadAddon(attachAddon);

      // term.onResize(size => {
      //   this.webSocket.send({ rows: size.rows });
      //   this.webSocket.send({ cols: size.cols });
      // });
    },
    beforeDestroy(){
      resizeObserver.unobserve(this.$refs.mainDiv);
    },
  };

</script>

<style scoped>
</style>