import getImageObject from "./helpers/getImageObject";

const Docker = require('dockerode');
var docker = new Docker({socketPath: '/var/run/docker.sock'});

export const fetchTask = function (serviceName) {
    return new Promise(async (resolve, reject) => {
        try {

            let opts = {}
            if (serviceName) {
                opts = {
                    filters: JSON.stringify({"service": [serviceName]})
                };
            }
            console.log("opts", opts)
            let data = await docker.listTasks(opts)

            //console.log("Task Data", JSON.stringify(data, null,4))

            let containers = data.map(
                item => ({
                    id: item?.ID,
                    nodeId: item.NodeID,
                    createdAt: item?.CreatedAt,
                    updatedAt: item?.UpdatedAt,
                    state: item?.Status?.State,
                    message: item?.Status?.Message,
                    image: getImageObject(item?.Spec?.ContainerSpec?.Image),
                    serviceId: item?.ServiceID,
                    containerId: item?.Status?.ContainerStatus?.ContainerID,
                    //labels: Object.entries(item.Labels).map(i => ({key: i[0], value: i[1]}))
                })
            )
            //console.log("tasks", containers)
            resolve(containers)
        } catch (e) {
            reject(e)
        }

    })
}


export const findTask = function (taskId) {
    return new Promise(async (resolve, reject) => {
        try {

            let dockerTask = await docker.getTask(taskId)
            let item = await dockerTask.inspect()

            let task = {
                id: item?.ID,
                nodeId: item.NodeID,
                createdAt: item?.CreatedAt,
                updatedAt: item?.UpdatedAt,
                state: item?.Status?.State,
                message: item?.Status?.Message,
                image: getImageObject(item?.Spec?.ContainerSpec?.Image),
                serviceId: item?.ServiceID,
                containerId: item?.Status?.ContainerStatus?.ContainerID,
                //labels: Object.entries(item.Labels).map(i => ({key: i[0], value: i[1]}))
            }

            resolve(task)
        } catch (e) {
            reject(e)
        }

    })
}


export const findTaskRunningByServiceAndNode = function (serviceName, nodeId) {
    return new Promise(async (resolve, reject) => {
        try {

            let opts = {
                filters: JSON.stringify({
                    service: [serviceName],
                    node: [nodeId],
                    "desired-state": ["running"]
                })
            };
            console.log("opts", opts)
            let tasks = await docker.listTasks(opts)
            let task
            if(!tasks || tasks.length === 0){
                return reject(new Error("Task not found"))
            }else{
                let item = tasks[0]
                task = {
                    id: item?.ID,
                    nodeId: item.NodeID,
                    createdAt: item?.CreatedAt,
                    updatedAt: item?.UpdatedAt,
                    state: item?.Status?.State,
                    message: item?.Status?.Message,
                    image: getImageObject(item?.Spec?.ContainerSpec?.Image),
                    serviceId: item?.ServiceID,
                    containerId: item?.Status?.ContainerStatus?.ContainerID,
                    //labels: Object.entries(item.Labels).map(i => ({key: i[0], value: i[1]}))
                }
                return resolve(task)
            }

            resolve(task)
        } catch (e) {
            reject(e)
        }

    })
}


export const dnsTaskRunningByServiceAndNode = function (serviceName, nodeId) {
    return new Promise(async (resolve, reject) => {
        try {
            let task = await findTaskRunningByServiceAndNode(serviceName, nodeId)
            if(task){
                let dns = serviceName + "." + nodeId + "." + task.id
                return resolve(dns)
            }else{
                return reject(new Error("Task not found"))
            }

        } catch (e) {
            reject(e)
        }

    })
}

export const runTerminalOnRemoteTaskContainer = function (nodeId, containerId, terminal = 'bash') {
    return new Promise(async (resolve, reject) => {
        try {
            const path = `/api/docker/container/${containerId}/runterminal/${terminal}`;
            
            const DEFAULT_AGENT_SERVICE_NAME = "dockerway_incatainer-agent";
            const agentServiceName = process.env.AGENT_SERVICE_NAME ? process.env.AGENT_SERVICE_NAME : DEFAULT_AGENT_SERVICE_NAME;

            const DNS = await dnsTaskRunningByServiceAndNode(agentServiceName, nodeId);
            const URL = `http://${DNS}${path}`;
            console.log("Remote Task Container URL: ", URL);

            const axios = require('axios');
            const response = await axios.get(URL);

            if(response.status == 200){
                console.log("Agent endpoint consumed");

                const { createWebSocketStream, WebSocket, WebSocketServer } = require('ws');

                // Fortes Backend WebSocketSERVER
                const webSocketServer = new WebSocketServer({ port: 9999 });
                webSocketServer.on('connection', (backWS) => {
                    backWS.onmessage = ({data}) => {
                        console.log(data.toString());
                        agentWS.send(data.toString());
                    }; //send to agent WebSocketSERVER

                    backWS.on('data', (chunk) => {
                        console.log(chunk.toString());
                        backWS.send(chunk.toString());
                    }); //send to client

                    backWS.on('close', () => {
                        webSocketServer.close();
                        duplex.destroy();
                    });
                });
                
                
                const agentWS = new WebSocket(`ws://${DNS}:8080`);
                const agentDuplex = createWebSocketStream(agentWS, { encoding: 'utf8' });
                
                agentWS.onmessage = ({data}) => {
                    webSocketServer.
                };

                resolve('Agent and back LINKED');
            }else{
                console.log("Could NOT consume agent endpoint");
                reject(new Error(response.data));
            }
        } catch (error) {
            reject(error);
        }
    })
}