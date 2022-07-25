import getImageObject from "./helpers/getImageObject";
import mapInspectToServiceModel from "./helpers/mapInspectToServiceModel";

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

export const findTaskLogs = function (taskId, tail = 100) {
    return new Promise(async (resolve, reject) => {
        try {

            console.log("task", taskId)

            let filters = {
                stdout: true,
                stderr: true,
                since: 0,
                timestamps: true,
                tail: tail
            }

            let logs = await docker.getTask(taskId).logs(filters)

            logs = logs.toString('utf8').replace(/\u0000|\u0002/g, "").replace(/�/g, "").split('\n')

            logs = logs.map(log => ({
                timestamp: log.substring(0, 30).trim(),
                text: log.substring(31)
            })).filter(log => log.text)

            //logs = logs.sort((a,b) => (a.timestamp < b.timestamp))
            resolve(logs)
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
