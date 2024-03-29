import { DefaultLogger as winston } from "@dracul/logger-backend";
import { createAudit } from "@dracul/audit-backend";
import dayjs from 'dayjs';

const Docker = require('dockerode')
const docker = new Docker({ socketPath: '/var/run/docker.sock' })

export const dockerNodesServicesAndTasksQuantity = async () => {
    try {
        const services = await docker.listServices()
        const tasks = await docker.listTasks()
        const nodes = await docker.listNodes()
        return { servicesQuantity: services.length, tasksQuantity: tasks.length, nodesQuantity: nodes.length }
    } catch (error) {
        throw new Error(error)
    }
}

export const dockerVersion = function (id) {
    return new Promise(async (resolve, reject) => {
        try {
            const version = await docker.version()

            resolve(version)
        } catch (error) {
            reject(error)
        }

    })
}

export const dockerRestartMany = function (user, serviceIds) {
    return new Promise(async (resolve, reject) => {
        try {
            const result = []
            for (let serviceId of serviceIds) {
                result.push(await dockerRestart(user, serviceId))
            }

            resolve(result)
        } catch (error) {
            reject(error)
        }

    })
}

export const dockerRestart = async function (user, serviceId) {
    try {
        const service = await docker.getService(serviceId)
        const serviceInspected = await service.inspect()

        const opts = serviceInspected.Spec
        opts.version = parseInt(serviceInspected.Version.Index)
        opts.TaskTemplate.ForceUpdate = 1

        if (opts.TaskTemplate.ContainerSpec.Env) {
            opts.TaskTemplate.ContainerSpec.Env.push("CONTROL_VERSION=" + opts.version)
        } else {
            opts.TaskTemplate.ContainerSpec.Env = ["CONTROL_VERSION=" + opts.version]
        }

        opts.Labels["LastUpdate"] = dayjs().toString()

        const result = await service.update(opts)
        await createAudit(user, { user: user.id, action: 'RESTART', resource: serviceInspected.Spec.Name })
        
        return result
    } catch (error) {
        winston.error(`An error happened at the dockerRestart function: '${error}'`)
        throw error
    }
}

//REMOVE
export const dockerRemoveMany = function (user, serviceIds) {
    return new Promise(async (resolve, reject) => {
        try {
            const result = []
            for (let serviceId of serviceIds) {
                result.push(await dockerRemove(user, serviceId))
            }

            resolve(result)
        } catch (error) {
            reject(error)
        }

    })
}

export const dockerRemove = async function (user, serviceId) {
    try {
        const service = await docker.getService(serviceId)
        const serviceInspected = await service.inspect()

        const result = await service.remove()
        await createAudit(user, { user: user.id, action: 'REMOVE', resource: serviceInspected.Spec.Name })

        return result
    } catch (error) {
        winston.error(`An error happpened at the dockerRemove function: '${error}'`)
        throw error
    }
}
