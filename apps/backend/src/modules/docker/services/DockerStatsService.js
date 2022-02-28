import getImageObject from "./helpers/getImageObject";
import {fetchTask, findTask} from "./DockerTaskService";
import {findService, findServiceByName} from "./DockerService";

const Docker = require('dockerode');
var docker = new Docker({socketPath: '/var/run/docker.sock'});


export const serviceStatsByName = function (serviceName) {
    return new Promise(async (resolve, reject) => {
        try {
            let service = await findServiceByName(serviceName)
            console.log("service",service)
            let stats = await serviceStats(service.id)
            resolve(stats)
        } catch (e) {
            reject(e)
        }

    })
}

export const serviceStats = function (serviceId) {
    return new Promise(async (resolve, reject) => {
        try {

            let tasks = await fetchTask(serviceId)
            let stats = []
            for(let task of tasks){
                if(task.state === "running"){
                    let s = await containerStats(task.containerId)
                    stats.push({task, stats: s})
                }

            }

            resolve(stats)
        } catch (e) {
            reject(e)
        }

    })
}

export const taskStats = function (taskId) {
    return new Promise(async (resolve, reject) => {
        try {

            let task = await findTask(taskId)
            let stats = await containerStats(task.containerId)
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
