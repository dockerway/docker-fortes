import { dnsTaskRunningByServiceAndNode, fetchTask, findTask } from "./DockerTaskService";
import { findServiceByName } from "./DockerService";
import axios from "axios";

const Docker = require('dockerode');
var docker = new Docker({ socketPath: '/var/run/docker.sock' });


export const serviceStatsByName = async function (serviceName) {
    try {
        const service = await findServiceByName(serviceName)
        return (await serviceStats(service.id))
    } catch (error) {
        console.error(`An error happened at the serviceStatsByName function: '${error.message ? error.message : error}'`)
        return []
    }
}

export const serviceStats = async function (serviceId) {
    try {
        let tasks = await fetchTask(serviceId)
        let stats = []

        for (let task of tasks) {
            if (task.state === "running") {
                const containerStats = await remoteContainerStats(task.nodeId, task.containerId)
                stats.push({ task, stats: containerStats })
            }
        }

        return stats
    } catch (error) {
        console.error(`An error happened at the serviceStats function: '${error.message ? error.message : error}'`)
        throw error
    }

}

export const taskStats = async function (taskId) {
    try {
        const task = await findTask(taskId)
        const stats = await remoteContainerStats(task.nodeId, task.containerId)

        return ({ task, stats })
    } catch (error) {
        console.error(`An error happened at serviceStats function: '${error.message ? error.message : error}'`)
        return error
    }
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
            const DNS = `${await dnsTaskRunningByServiceAndNode(agentServiceName, nodeId)}:${process.env.AGENT_PORT}`;
            const URL = `http://${DNS}${path}`;

            console.log("remoteContainerStats URL Stats FINAL", URL);
            let response = await axios.get(URL);
            console.log("remoteContainerStats", response);
            if (response.status = 200) {
                resolve(response.data);
            } else {
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
            const opts = { stream: false };
            const metric = await container.stats(opts);

            //CPU
            const cpuDelta = metric.cpu_stats.cpu_usage.total_usage - metric.precpu_stats.cpu_usage.total_usage;
            const systemDelta = metric.cpu_stats.system_cpu_usage - metric.precpu_stats.system_cpu_usage;
            const cpu = cpuDelta / systemDelta * metric.cpu_stats.cpu_usage.percpu_usage.length * 100;
            stats.cpu = Math.round((cpu + Number.EPSILON) * 100) / 100;

            //Memory
            stats.memoryLimit = formatBytes(metric.memory_stats.limit);
            stats.memoryUsage = formatBytes(metric.memory_stats.usage);

            console.log("stats ", stats);
            resolve(stats);
        } catch (error) {
            reject(error);
        }

    })
}