<template>
  <main>
    <div class="webTerminalInfo">
      <h1>Consola</h1>
      <ul>
        <li id="stack">Stack: {{service.stack}}</li>
        <li id="taskID">Task: {{task.id}}</li>
        <li id="service">Servicio: {{serviceName}}</li>
      </ul>
    </div>

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
    name: "WebTerminal",
    props:{
      webSocket: WebSocket,
      task: Object,
      service: Object,
      terminalSelected: String,
    },
    data(){
      return {
        wsId: uuidv4()
      }
    },
    mounted() {
      console.log(this.task)
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
          nodeId: this.task.nodeId,
          containerId: this.task.containerId,
          payload: payload
        }

        this.webSocket.send(JSON.stringify(json));
      });

      this.webSocket.addEventListener('message', (message) => {
        const backMessage = JSON.parse(message.data)
        console.log('Message from server', backMessage.payload)

        if (backMessage.containerId == this.task.containerId) {
          term.write(backMessage.payload)
        }
      })

      this.firstMessage()
    },
    methods: {
      firstMessage(){
        let json = {
          wsId: this.wsId,
          nodeId: this.task.nodeId,
          containerId: this.task.containerId,
          payload: '',
          terminalSelected: this.terminalSelected
        }
        this.webSocket.send(JSON.stringify(json));
      }
    },
    computed:{
      serviceName(){
        return this.service.name.substring(this.service.name.indexOf("_") + 1);
      }
    },
    beforeDestroy(){
      resizeObserver.unobserve(this.$refs.mainDiv);
    },
  };

</script>

<style scoped>

  @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');

  .webTerminalInfo {
    flex-direction: column;
    font-family: 'Roboto', sans-serif;
  }

  ul{
    color:rgb(88, 88, 88);
    font-size: 15px;
    gap: 20px;
    list-style: none;
    margin-top: 1vh;
  }

  .webTerminalInfo, ul{
    align-items: center;
    display: flex;
    justify-content: center;
    justify-items: center;
    width: 100%;
  }

  #mainDiv{
    margin-top: 3vh;
  }

</style>