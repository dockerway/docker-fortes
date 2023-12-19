import {createAudit} from "@dracul/audit-backend"
import dayjs from 'dayjs'

const Docker = require('dockerode')
const docker = new Docker({ socketPath: '/var/run/docker.sock' })

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
    return new Promise(async (resolve, reject) => {
        try {
            const service = await docker.getService(serviceId)
            const serviceInspected = await service.inspect()
            console.log("dockerRestart service", service)

            await createAudit(user, {user: user.id, action: 'RESTART', resource: serviceInspected.Spec.Name})

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
