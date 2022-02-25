import {createAudit} from "./AuditService";
const Docker = require('dockerode');
var docker = new Docker({socketPath: '/var/run/docker.sock'});

export const dockerVersion = function (id) {
    return new Promise(async (resolve, reject) => {
        try {
            let version = await docker.version()
            console.log("the version", version)
            resolve(version)
        } catch (e) {
            reject(e)
        }

    })
}

export const dockerRestartMany = function (user, serviceIds) {
    return new Promise(async (resolve, reject) => {
        try {
            let result = []
            for (let serviceId of serviceIds) {
                result.push(await dockerRestart(user, serviceId))
            }

            resolve(result)
        } catch (e) {
            reject(e)
        }

    })
}

export const dockerRestart = function (user, serviceId) {
    return new Promise(async (resolve, reject) => {
        try {
            let service = await docker.getService(serviceId)
            //console.log("dockerRestart service", service)
            let serviceInspected = await service.inspect()
            await createAudit(user, {user: user.id, action: 'RESTART', target: serviceInspected.Spec.Name})

            //console.log("Spec", JSON.stringify(serviceInspected, null, 4))

            let opts = serviceInspected.Spec
            opts.version = parseInt(serviceInspected.Version.Index)
            opts.TaskTemplate.ForceUpdate = 1

            //Force update?
            if (opts.TaskTemplate.ContainerSpec.Env) {
                opts.TaskTemplate.ContainerSpec.Env.push("SERVICE_VERSION=" + opts.version)
            } else {
                opts.TaskTemplate.ContainerSpec.Env = ["SERVICE_VERSION=" + opts.version]
            }

            opts.Labels["LastUpdate"] = dayjs().toString()
            console.log("opts", opts)

            let result = await service.update(opts)
            console.log("Restart result", result)
            resolve(result)
        } catch (e) {
            reject(e)
        }

    })
}


//REMOVE
export const dockerRemoveMany = function (user, serviceIds) {
    return new Promise(async (resolve, reject) => {
        try {
            let result = []
            for (let serviceId of serviceIds) {
                result.push(await dockerRemove(user, serviceId))
            }

            resolve(result)
        } catch (e) {
            reject(e)
        }

    })
}

export const dockerRemove = function (user, serviceId) {
    return new Promise(async (resolve, reject) => {
        try {

            let service = await docker.getService(serviceId)
            let serviceInspected = await service.inspect()
            await createAudit(user, {user: user.id, action: 'REMOVE', target: serviceInspected.Spec.Name})
            let result = await service.remove()

            resolve(result)
        } catch (e) {
            reject(e)
        }

    })
}
