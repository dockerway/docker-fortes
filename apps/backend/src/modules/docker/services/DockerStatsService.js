import getImageObject from "./helpers/getImageObject";
import {fetchTask, findTask} from "./DockerTaskService";
import {findService, findServiceByName} from "./DockerService";
import axios from "axios";

const Docker = require('dockerode');
var docker = new Docker({socketPath: '/var/run/docker.sock'});


export const serviceStatsByName = function (serviceName) {
    return new Promise(async (resolve, reject) => {
        try {
            let service = await findServiceByName(serviceName)
            let stats = await serviceStats(service.id, serviceName)
            resolve(stats)
        } catch (e) {
            reject(e)
        }

    })
}

export const serviceStats = function (serviceId, serviceName = null) {
    return new Promise(async (resolve, reject) => {
        try {

            if(!serviceName){
                let service = await findService(serviceId)
                serviceName = service.name
            }

            let tasks = await fetchTask(serviceId)
            let stats = []
            for(let task of tasks){
                if(task.state === "running"){
                    let s = await remoteContainerStats(serviceName, task.nodeId, task.id, task.containerId)
                    stats.push({task, stats: s})
                }

            }

            resolve(stats)
        } catch (e) {
            reject(e)
        }

    })
}

export const taskStats = function (serviceName, taskId) {
    return new Promise(async (resolve, reject) => {
        try {

            let task = await findTask(taskId)
            let stats = await remoteContainerStats(serviceName,task.nodeId, task.id, task.containerId)
            resolve({task, stats})
        } catch (e) {
            reject(e)
        }

    })
}


function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export const remoteContainerStats = function (serviceName, nodeId, taskId, containerId) {
    return new Promise(async (resolve, reject) => {
        try {

            let path = '/api/docker/container/' + containerId + '/stats'
            const HOST = "http://"+serviceName +"." + nodeId +"." + taskId
            const URL = HOST + path
            console.log("remoteContainerStats URL Stats FINAL", URL)
            let response = await axios.get(URL)
            console.log("remoteContainerStats", response)
            if (response.status = 200) {
                resolve(response.data)
            }else{
                reject(new Error(response.data))
            }
        } catch (e) {
            reject(e)
        }

    })
}

export const containerStats = function (containerId) {
    return new Promise(async (resolve, reject) => {
        try {
            let stats = {
                cpu: '',
                memoryLimit: '',
                memoryUsage: ''
            }
            let container = await docker.getContainer(containerId)

            let opts =  {stream: false};

            let metric = await container.stats(opts)

            //CPU
            let cpuDelta = metric.cpu_stats.cpu_usage.total_usage -  metric.precpu_stats.cpu_usage.total_usage;
            let systemDelta = metric.cpu_stats.system_cpu_usage - metric.precpu_stats.system_cpu_usage;
            let cpu= cpuDelta / systemDelta * metric.cpu_stats.cpu_usage.percpu_usage.length * 100;
            stats.cpu = Math.round((cpu + Number.EPSILON) * 100) / 100

            //Memory
            stats.memoryLimit = formatBytes(metric.memory_stats.limit)
            stats.memoryUsage = formatBytes(metric.memory_stats.usage)

            console.log("stats ",stats)
            resolve(stats)
        } catch (e) {
            reject(e)
        }

    })
}
