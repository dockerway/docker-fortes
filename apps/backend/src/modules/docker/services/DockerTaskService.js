import { getSettingsValueByKey } from "@dracul/settings-backend";
import getImageObject from "./helpers/getImageObject";
import Docker from "dockerode";
import winston from "winston";

const { Transform } = require('stream');
const { Readable } = require('stream');

const docker = new Docker({ socketPath: '/var/run/docker.sock' })

export const fetchTask = async function (serviceIdentifier) {
    try {
        if (!serviceIdentifier) throw new Error("You need to specify an service identifier (id or name)!")

        const task = await docker.listTasks({ filters: JSON.stringify({ "service": [serviceIdentifier] }) })
        return task.map(
            item => ({
                id: item?.ID,
                nodeId: item.NodeID,
                createdAt: item?.CreatedAt,
                updatedAt: item?.UpdatedAt,
                state: item?.Status?.State,
                message: item?.Status?.Message,
                image: getImageObject(item?.Spec?.ContainerSpec?.Image),
                serviceId: item?.ServiceID,
                containerId: item?.Status?.ContainerStatus?.ContainerID
            })
        )
    } catch (error) {
        throw error
    }
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

export const findTaskLogs = async function ({ taskId, filters, webSocketClient }) {
    try {
        const maxTail = await getSettingsValueByKey('maxLogsLines')
        const apiFilters = {
            details: false,
            follow: true, // if true logs is a stream
            stdout: true,
            stderr: true,
            since: filters.since ? filters.since : 0, //default 0 (int)
            timestamps: filters.timestamps ? filters.timestamps : false, //default false
            tail: Number(filters?.tail) < Number(maxTail) ? Number(filters?.tail) : Number(maxTail)  //int or default "all"
        }

        const logs = (await docker.getTask(taskId).logs(apiFilters))
        const logStream = Readable.from(logs)

        webSocketClient.on('close', handleDisconnect);
        webSocketClient.on('disconnect', handleDisconnect);

        function handleDisconnect() {
            logStream.destroy()
        }

        logStream.on('data', (log) => {
            log = deleteDockerHeaders(log).toString().replace(/�/g, "")
            webSocketClient.send(log)
        })
    } catch (error) {
        throw (error)
    }


    function deleteDockerHeaders(chunk) {

        function chunkIndexIsInsideDockerHeadersRange(chunkIndex) {
            let result

            for (let dockerHeaderIndex = 0; dockerHeaderIndex < dockerHeaderIndexes.length; dockerHeaderIndex++) {
                result = (chunkIndex >= dockerHeaderIndexes[dockerHeaderIndex].start && chunkIndex <= dockerHeaderIndexes[dockerHeaderIndex].end)
                if (result === true) break
            }

            return result
        }

        const dockerHeaderIndexes = []
        const trimmeredChunkArray = []

        let chunkDockerHeaderSearchIndex = 0
        let dockerHeadersIndex = chunk.indexOf('01000000', chunkDockerHeaderSearchIndex, 'hex')

        let allDockerHeadersFromChunkWereDetected = false

        while (allDockerHeadersFromChunkWereDetected == false) {
            if (dockerHeadersIndex === -1) {
                allDockerHeadersFromChunkWereDetected = true
            } else {
                dockerHeaderIndexes.push({ start: dockerHeadersIndex, end: (dockerHeadersIndex + 7) })

                dockerHeadersIndex = chunk.indexOf('01000000', chunkDockerHeaderSearchIndex, 'hex')
                chunkDockerHeaderSearchIndex = (dockerHeadersIndex + 7)
            }
        }

        for (let index = 0; index < chunk.length; index++) {
            if (chunkIndexIsInsideDockerHeadersRange(index)) {
                continue
            } else {
                trimmeredChunkArray.push(chunk[index])
            }
        }

        return Buffer.from(trimmeredChunkArray)
    }
}

export const fetchTaskInspect = async function (taskId) {
    try {
        return await docker.getTask(taskId).inspect()
    }
    catch (error) {
        throw (error)
    }
}


export const findTaskRunningByServiceAndNode = async function (serviceName, nodeId) {
    try {
        const opts = {
            filters: JSON.stringify({
                service: [serviceName],
                node: [nodeId],
                "desired-state": ["running"]
            })
        }

        const tasks = await docker.listTasks(opts)
        if (!tasks || tasks.length === 0) throw new Error("Task not found")

        return {
            id: tasks[0]?.ID,
            nodeId: tasks[0].NodeID,
            createdAt: tasks[0]?.CreatedAt,
            updatedAt: tasks[0]?.UpdatedAt,
            state: tasks[0]?.Status?.State,
            message: tasks[0]?.Status?.Message,
            image: getImageObject(tasks[0]?.Spec?.ContainerSpec?.Image),
            serviceId: tasks[0]?.ServiceID,
            containerId: tasks[0]?.Status?.ContainerStatus?.ContainerID,
        }

    } catch (error) {
        console.warn(error)
    }
}

export const dnsTaskRunningByServiceAndNode = async function (serviceName, nodeId) {
    try {
        const task = await findTaskRunningByServiceAndNode(serviceName, nodeId)
        if (!task) throw new Error("Task not found")

        return `${serviceName}.${nodeId}.${task.id}`

    } catch (error) {
        throw (error)
    }
}