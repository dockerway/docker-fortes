import {AuditProvider} from "@dracul/audit-frontend"
import dayjs from 'dayjs'

const Docker = require('dockerode')
const docker = new Docker({socketPath: '/var/run/docker.sock'})

export const dockerVersion = function (id) {
    return new Promise(async (resolve, reject) => {
        try {
            const version = await docker.version()
            console.log("the version", version)

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

export const dockerRestart = function (user, serviceId) {
    console.log(`Docker Restart`)
    return new Promise(async (resolve, reject) => {
        try {
            const service = await docker.getService(serviceId)
            console.log("dockerRestart service", service)

            const serviceInspected = await service.inspect()
            await AuditProvider.createAudit({user: user.id, action: 'RESTART', target: serviceInspected.Spec.Name})

            const opts = serviceInspected.Spec
            opts.version = parseInt(serviceInspected.Version.Index)
            opts.TaskTemplate.ForceUpdate = 1

            //Force update?
            if (opts.TaskTemplate.ContainerSpec.Env) {
                opts.TaskTemplate.ContainerSpec.Env.push("CONTROL_VERSION=" + opts.version)
            } else {
                opts.TaskTemplate.ContainerSpec.Env = ["CONTROL_VERSION=" + opts.version]
            }

            opts.Labels["LastUpdate"] = dayjs().toString()
            console.log("opts", opts)

            const result = await service.update(opts)
            console.log("Restart result", result)
            resolve(result)
        } catch (error) {
            reject(error)
        }

    })
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

export const dockerRemove = function (user, serviceId) {
    return new Promise(async (resolve, reject) => {
        try {
            const service = await docker.getService(serviceId)
            const serviceInspected = await service.inspect()
            await AuditProvider.createAudit({user: user.id, action: 'REMOVE', target: serviceInspected.Spec.Name})
            
            const result = await service.remove()
            resolve(result)
        } catch (error) {
            reject(error)
        }

    })
}
