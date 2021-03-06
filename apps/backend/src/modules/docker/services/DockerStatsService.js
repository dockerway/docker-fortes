import {dnsTaskRunningByServiceAndNode, fetchTask, findTask} from "./DockerTaskService";
import {findServiceByName} from "./DockerService";
import axios from "axios";

const Docker = require('dockerode');
var docker = new Docker({socketPath: '/var/run/docker.sock'});


export const serviceStatsByName = function (serviceName) {
    return new Promise(async (resolve, reject) => {
        try {
            let service = await findServiceByName(serviceName);
            let stats = await serviceStats(service.id);

            resolve(stats);
        } catch (error) {
            reject(error);
        }
    })
}

export const serviceStats = function (serviceId) {
    return new Promise(async (resolve, reject) => {
        try {
            let tasks = await fetchTask(serviceId);
            let stats = [];

            for(let task of tasks){
                if(task.state === "running"){
                    let s = await remoteContainerStats(task.nodeId, task.containerId);
                    stats.push({task, stats: s});
                }
            }

            resolve(stats);
        } catch (error) {
            reject(error);
        }

    })
}

export const taskStats = function (taskId) {
    return new Promise(async (resolve, reject) => {
        try {
            let task = await findTask(taskId);
            let stats = await remoteContainerStats(task.nodeId,  task.containerId);

            resolve({task, stats});
        } catch (error) {
            reject(error);
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

export const remoteContainerStats = function (nodeId, containerId) {
    return new Promise(async (resolve, reject) => {
        try {
            const path = '/api/docker/container/' + containerId + '/stats';

            const DEFAULT_AGENT_SERVICE_NAME = "dockerway_incatainer-agent";
            const agentServiceName = process.env.AGENT_SERVICE_NAME ? process.env.AGENT_SERVICE_NAME : DEFAULT_AGENT_SERVICE_NAME;
            const DNS = await dnsTaskRunningByServiceAndNode(agentServiceName, nodeId);
            const URL = `http://${DNS}${path}`;

            console.log("remoteContainerStats URL Stats FINAL", URL);
            let response = await axios.get(URL);
            console.log("remoteContainerStats", response);
            if (response.status = 200) {
                resolve(response.data);
            }else{
                reject(new Error(response.data));
            }
        } catch (error) {
            reject(error);
        }

    })
}

export const containerStats = function (containerId) {
    return new Promise(async (resolve, reject) => {
        try {
            const stats = {
                cpu: '',
                memoryLimit: '',
                memoryUsage: ''
            };

            const container = await docker.getContainer(containerId);
            const opts =  {stream: false};
            const metric = await container.stats(opts);

            //CPU
            const cpuDelta = metric.cpu_stats.cpu_usage.total_usage -  metric.precpu_stats.cpu_usage.total_usage;
            const systemDelta = metric.cpu_stats.system_cpu_usage - metric.precpu_stats.system_cpu_usage;
            const cpu= cpuDelta / systemDelta * metric.cpu_stats.cpu_usage.percpu_usage.length * 100;
            stats.cpu = Math.round((cpu + Number.EPSILON) * 100) / 100;

            //Memory
            stats.memoryLimit = formatBytes(metric.memory_stats.limit);
            stats.memoryUsage = formatBytes(metric.memory_stats.usage);

            console.log("stats ",stats);
            resolve(stats);
        } catch (error) {
            reject(error);
        }

    })
}