import { getSettingsValueByKey } from "@dracul/settings-backend";
import getImageObject from "./helpers/getImageObject";
import Docker from "dockerode";
import winston from "winston";

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


export const findTask = async function (taskId) {
    try {
        const dockerTask = await docker.getTask(taskId)
        const item = await dockerTask.inspect()

        const task = {
            id: item?.ID,
            nodeId: item.NodeID,
            createdAt: item?.CreatedAt,
            updatedAt: item?.UpdatedAt,
            state: item?.Status?.State,
            message: item?.Status?.Message,
            image: getImageObject(item?.Spec?.ContainerSpec?.Image),
            serviceId: item?.ServiceID,
            containerId: item?.Status?.ContainerStatus?.ContainerID,
        }

        return task
    } catch (error) {
        winston.error(`An error happened at findTask: '${error}'`)
    }
}

export const findTaskIDs = async function (taskId) {
    try {
        const dockerTask = await docker.getTask(taskId)
        const item = await dockerTask.inspect()

        const taskIDs = {
            nodeId: item.NodeID,
            serviceId: item?.ServiceID,
            containerId: item?.Status?.ContainerStatus?.ContainerID,
        }

        return taskIDs
    } catch (error) {
        winston.error(`An error happened at findTaskIDs: '${error}'`)
    }
}

export const findTaskLogs = async function ({ taskId, filters, webSocketClient }) {
    try {
        const maxTail = await getSettingsValueByKey('maxLogsLines')
        const apiFilters = {
            details: false,
            follow: true, // if true logs is a stream
            stdout: true,
            stderr: true,
            since: filters?.since ? filters.since : 0, //default 0 (int)
            timestamps: filters?.timestamps ? filters.timestamps : false, //default false
            tail: Number(filters?.tail) < Number(maxTail) ? Number(filters?.tail) : Number(maxTail)  //int or default "all"
        }

        const logs = (await docker.getTask(taskId).logs(apiFilters))
        const logStream = Readable.from(logs)

        webSocketClient.on('close', handleDisconnect)
        webSocketClient.on('disconnect', handleDisconnect)

        function handleDisconnect() {
            logStream.destroy()
        }

        logStream.on('data', (chunk) => {
            if (filters.search) {
                const logs = deleteDockerHeaders(chunk).toString().replace(/�/g, "").split('\n')
                const searchTerm = filters.search.toLowerCase()

                logs.forEach(log => {
                    const cleanedLog = log.replace(/\u001b\[[0-9;]*m/g, '').toLowerCase()
                    const regex = new RegExp(`${searchTerm}`, 'i')

                    if (regex.test(cleanedLog)) webSocketClient.send(log + '\n')
                })
            } else {
                let log = deleteDockerHeaders(chunk).toString().replace(/�/g, "")
                webSocketClient.send(log)
            }
        })
    } catch (error) {
        winston.error(`An error happened at the findTaskLogs function: '${error}'`)
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

export const getTaskLogStrings = async function (taskId, filters) {
    try {
        const maxTail = await getSettingsValueByKey('maxLogsLines')
        const apiFilters = {
            details: false, //default false
            follow: false, //default false
            stdout: true, //default false
            stderr: true, //default false
            since: filters?.since, //default 0 (int)
            timestamps: filters?.timestamps, //default false
            tail: Number(filters?.tail) < Number(maxTail) ? Number(filters?.tail) : Number(maxTail)  //int or default "all"
        }

        let logs = await docker.getTask(taskId).logs(apiFilters)

        logs = logs.toString('utf8').replace(/\u0000|\u0002|/g, "").replace(/�/g, "")
            .split('\n')
            .map(log => ({ text: log }))
            .filter(log => filters.fetch != "" ? log.text.toLowerCase().includes(filters.fetch.toLowerCase()) : log.text)

        return logs
    } catch (error) {
        throw (error)
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

export const fetchTasksByNodeId = async function (nodeId) {
    try {
        const opts = {
            filters: JSON.stringify({
                node: [nodeId]
            })
        }

        const tasks = await docker.listTasks(opts)
        if (!tasks || tasks.length === 0) throw new Error("Task not found")

        return tasks.map(task => ({
            id: task?.ID,
            nodeId: task.NodeID,
            createdAt: task?.CreatedAt,
            updatedAt: task?.UpdatedAt,
            state: task?.Status?.State,
            message: task?.Status?.Message,
            image: getImageObject(task?.Spec?.ContainerSpec?.Image),
            serviceId: task?.ServiceID,
            containerId: task?.Status?.ContainerStatus?.ContainerID,
        }))
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