<template>
  <main>
    <div ref="mainDiv" id="mainDiv"></div>
  </main>
</template>

<script>
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';

  let term = new Terminal();
  const fitAddon = new FitAddon();

  term.loadAddon(fitAddon);
  fitAddon.activate(term);
  fitAddon.fit();
  const resizeObserver = new ResizeObserver(() => fitAddon.fit());


  export default {
    name: "DockerInfo",
    props:{
      webSocket: Object,
      containerId: String
    },
    mounted(){
      resizeObserver.observe(this.$refs.mainDiv);

      term.clear();
      term.reset();

      term.open(this.$refs.mainDiv);

      term.loadAddon(fitAddon);
      fitAddon.fit();

      term.onData((payload) =>{
        console.log('TERM ONDATA: ', payload);
        this.webSocket.send(payload);
      });

      this.webSocket.addEventListener('message', ({event}) => {
        console.log('Message from server', event.data);
        const backMessage = JSON.parse(event.data);

        if(backMessage.containerId == this.containerId){
          term.write(backMessage.payload);
        }
      });

    },
    beforeDestroy(){
      resizeObserver.unobserve(this.$refs.mainDiv);
    },
  };

</script>