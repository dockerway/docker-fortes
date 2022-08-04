<template>
  <main>
    <div ref="mainDiv" id="mainDiv"></div>
  </main>
</template>

<script>
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { v4 as uuidv4 } from 'uuid';

  let term = new Terminal();
  const fitAddon = new FitAddon();

  term.loadAddon(fitAddon);
  fitAddon.activate(term);
  fitAddon.fit();
  const resizeObserver = new ResizeObserver(() => fitAddon.fit());


  export default {
    name: "DockerInfo",
    props:{
      webSocket: WebSocket,
      containerId: String,
      nodeId: String,
    },
    data(){
      return {
        wsId: uuidv4()
      }
    },
    mounted() {
      resizeObserver.observe(this.$refs.mainDiv);

      term.clear();
      term.reset();

      term.open(this.$refs.mainDiv);

      term.loadAddon(fitAddon);
      fitAddon.fit();



      term.onData((payload) => {
        console.log('TERM ONDATA: ', payload);
        let json = {
          wsId: this.wsId,
          nodeId: this.nodeId,
          containerId: this.containerId,
          payload: payload
        }

        this.webSocket.send(JSON.stringify(json));
      });

      this.webSocket.addEventListener('message', (message) => {
        const backMessage = JSON.parse(message.data)
        console.log('Message from server', backMessage.payload)

        if (backMessage.containerId == this.containerId) {
          term.write(backMessage.payload)
        }
      })

      this.firstMessage()

    },
    methods: {
      firstMessage(){
        let json = {
          wsId: this.wsId,
          nodeId: this.nodeId,
          containerId: this.containerId,
          payload: ''
        }
        this.webSocket.send(JSON.stringify(json));
      }
    },
    beforeDestroy(){
      resizeObserver.unobserve(this.$refs.mainDiv);
    },
  };

</script>
