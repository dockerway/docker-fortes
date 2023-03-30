import mapInspectToServiceModel from "./helpers/mapInspectToServiceModel"
import {createAudit} from "@dracul/audit-backend"
import Docker from "dockerode"

const docker = new Docker({socketPath: '/var/run/docker.sock'})


export const findServiceTag = async function (name) {
    try {
        return ((await findServiceByName(name)).image.tag)
    } catch (error) {
        throw error
    }
}

export const findServiceByName = async function (name) {
    try {
      const opts = name ? { filters: JSON.stringify({ name: [name] }) } : {};

      const services = await docker.listServices(opts);
      if (!services || services.length === 0) throw new Error("Service not found")
      if (services.length === 1) return mapInspectToServiceModel(services[0])
  
      const matchingServices = services.filter(item => item?.Spec?.Name === name);

      switch (matchingServices.length) {
        case 0:
            throw new Error("Service not found")
        case 1:
            return mapInspectToServiceModel(matchingServices[0])
        default:
            throw new Error("Multiple match. Refine filter name")
        }
    } catch (error) {
      throw error
    }
}
  

export const findServiceById = async function (serviceId) {
    try {
        const item = await docker.getService(serviceId).inspect()
        if (!item) throw new Error("Service not found")
         
        return mapInspectToServiceModel(item)
    } catch (error) {
        throw error
    }
}

/**

Finds a service by either id or name.

@param {string} serviceIdentifier - The service identifier of the service to find. It can be an ID or a name.
@returns {Promise<Object>} - A promise that resolves with the service object found.

@throws {Error} - If a service identifier is NOT specified.
*/
export const findServiceByIdOrName = async function(serviceIdentifier){
    if (!serviceIdentifier) throw new Error("You need to specify an service identifier (id or name)!")
    const serviceIdentifierIsAnId = serviceIdentifier.match(/[a-z0-9]{25}/)

    console.log(`serviceIdentifierIsAnId: '${serviceIdentifierIsAnId}'`)
    console.log(`serviceIdentifier: '${serviceIdentifier}'`)

    return (serviceIdentifierIsAnId) ? (await findServiceById(serviceIdentifier)) : (await findServiceByName(serviceIdentifier))
}

export const fetchService = async function (stack) {
    try {
        const opts = {}
        if (stack) opts.filters = JSON.stringify({ "label": ["com.docker.stack.namespace=" + stack] })
        
        const data = await docker.listServices(opts)
        const services = data.map(item => (mapInspectToServiceModel(item)))

        return services
    } catch (error) {
        throw error
    }
}

const prepareConstraintsArray = (constraints) => constraints.map(constraint => (constraint.name + " " + constraint.operation + " " + constraint.value))
const preparePreferencesArray = (preferences) => preferences.map(preference => ({ [preference.name]: { "SpreadDescriptor": preference.value } }))


const prepareServiceConfig = async (version = "1", { name, stack, image, replicas = 1, volumes = [], ports = [], envs = [], labels = [], constraints = [], limits = {}, preferences = [], networks = [] }) => {
    const constraintsArray = await prepareConstraintsArray(constraints)
    const preferencesArray = await preparePreferencesArray(preferences)

    envs.push({ name: "CONTROL_VERSION", value: version })
    labels.push({ name: "com.docker.stack.namespace", value: stack })

    const dockerService = {
        Name: name,
        version: version,
        TaskTemplate: {
            ContainerSpec: {
                Image: image,
                Mounts: volumes.map(v => (
                    {
                        Source: v.hostVolume,
                        Target: v.containerVolume,
                        Type: "bind"
                    })),
                Env: envs.map(e => e.name + "=" + e.value)
            },
            Placement: {
                Constraints: constraintsArray,
                Preferences: preferencesArray
            },
            Resources: {
                Limits: {
                    NanoCPUs: limits.CPULimit,
                    MemoryBytes: limits.memoryLimit
                },
                Reservations: {
                    NanoCPUs: limits.CPUReservation,
                    MemoryBytes: limits.memoryReservation
                }
            },
            RestartPolicy: {
                Condition: "on-failure",
                Delay: 10000000000,
                MaxAttempts: 10
            }
        },
        Mode: {
            Replicated: {
                Replicas: replicas
            }
        },
        UpdateConfig: {
            Parallelism: 2,
            Delay: 1000000000,
            FailureAction: "pause",
            Monitor: 15000000000,
            MaxFailureRatio: 0.15
        },
        RollbackConfig: {
            Parallelism: 1,
            Delay: 1000000000,
            FailureAction: "pause",
            Monitor: 15000000000,
            MaxFailureRatio: 0.15
        },
        Networks : (networks.length > 0) ? networks.forEach((network) => { return {network}}) : [{
            Target: `${stack}_default`,
            Aliases: []
        }],
        EndpointSpec: {
            Ports: ports.map(p => ({
                Protocol: "tcp",
                PublishedPort: parseInt(p.hostPort),
                TargetPort: parseInt(p.containerPort)
            }))
        },
        Labels: labels.reduce((obj, item) => {
            return { ...obj, [item.name]: item.value, }
        }, {})

    }


    console.log(`dockerService: '${JSON.stringify(dockerService.Networks)}'`)

    return dockerService
}

export const dockerServiceCreate = async function (user, { name, stack, image, replicas = 1, volumes = [], ports = [], envs = [], labels = [], constraints = [], limits = {}, preferences = [], networks = [] }) {
    try {
        if (user) await createAudit(user, {user: user.id, action: 'CREATE', resource: name})

        const dockerServiceConfig = await prepareServiceConfig(1, {
            name,
            stack,
            image,
            replicas,
            volumes,
            ports,
            envs,
            labels,
            constraints,
            limits,
            preferences,
            networks
        })

        const result = await docker.createService(dockerServiceConfig)
        const inspect = await docker.getService(result.id).inspect()

        return(mapInspectToServiceModel(inspect))

    } catch (error) {
        const serviceAlreadyExists = error.message.includes("name conflicts with an existing object")
        if(serviceAlreadyExists) throw new Error(`Service already exists with ID '${(await findServiceByName(name)).id}'`)

        console.error(`error.message: '${error.message}'`)
        throw error
    }
}

export const dockerServiceUpdate = async function (user, serviceId, { name, stack, image, replicas = 1, volumes = [], ports = [], envs = [], labels = [], constraints = [], limits = {}, preferences = [], networks = [] }) {
    try {
        if (user) await createAudit(user, {user: user.id, action: 'UPDATE', resource: name})

        let service = await docker.getService(serviceId)

        const serviceInspected = await service.inspect()
        const version = parseInt(serviceInspected.Version.Index)

        const dockerServiceConfig = await prepareServiceConfig(version, {
            name,
            stack,
            image,
            replicas,
            volumes,
            ports,
            envs,
            labels,
            constraints,
            limits,
            preferences,
            networks
        })

        await docker.getService(serviceId).update(dockerServiceConfig)
        const inspect = await docker.getService(serviceId).inspect()

        return(mapInspectToServiceModel(inspect))

    } catch (error) {
        throw error
    }
}

