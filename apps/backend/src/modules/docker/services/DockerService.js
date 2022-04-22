import {createAudit} from "./AuditService";

const Docker = require('dockerode');
var docker = new Docker({socketPath: '/var/run/docker.sock'});
import mapInspectToServiceModel from "./helpers/mapInspectToServiceModel";


export const findServiceTag = function (name) {

    return new Promise(async (resolve, reject) => {

        try {
            let service = await findServiceByName(name)
            resolve(service.image.tag)

        } catch (e) {
            reject(e)
        }

    })

}

export const findServiceByName = function (name) {
    return new Promise(async (resolve, reject) => {
            try {

                let opts = {}
                if (name) {
                    opts = {
                        filters: JSON.stringify({"name": [name]})
                    };
                }
                //console.log("opts",opts)
                let services = await docker.listServices(opts)
                let service

                if (!services || services.length === 0) {
                    return reject(new Error("Service not found"))
                } else if (services.length === 1) {
                    let item = services[0]
                    service = mapInspectToServiceModel(item)
                    return resolve(service)
                } else if (services.length > 1) {

                    for (let item of services) {
                        if (name === item?.Spec?.Name) {
                            service = mapInspectToServiceModel(item)
                            return resolve(service)
                        }
                    }

                    return reject(new Error("Multiple match. Refine filter name"))
                }

                return reject(new Error("Service not found"))
            } catch (e) {
                reject(e)
            }

        }
    )
}

export const findService = function (serviceId) {
    return new Promise(async (resolve, reject) => {
        try {

            let item = await docker.getService(serviceId)
            if (!item) {
                return reject(new Error("Service not found"))
            }
            let service = mapInspectToServiceModel(item)
            return resolve(service)

        } catch (e) {
            reject(e)
        }

    })
}

export const fetchService = function (stack) {
    return new Promise(async (resolve, reject) => {
        try {

            let opts = {}
            if (stack) {
                opts = {
                    filters: JSON.stringify({"label": ["com.docker.stack.namespace=" + stack]})
                };
            }
            //console.log("opts",opts)
            let data = await docker.listServices(opts)
            //console.log("service data", JSON.stringify(data, null, 4))
            let services = data.map(item => (mapInspectToServiceModel(item)))
            //console.log("services",services)
            resolve(services)
        } catch (e) {
            reject(e)
        }

    })
}

const prepareConstraintsArray = (constraints) => {
    return constraints.map(constraint => (constraint.name + " " + constraint.operation + " " + constraint.value))
}

const preparePreferencesArray = (preferences) => {
    return preferences.map(preference => ({[preference.name]: {"SpreadDescriptor": preference.value}}))
}

const prepareServiceConfig = async (version = "1", {name, stack, image, replicas = 1, volumes = [], ports = [], envs = [], labels = [], constraints = [], limits = {}, preferences = []}) => {
    let constraintsArray =  await prepareConstraintsArray(constraints)
    let preferencesArray =  await preparePreferencesArray(preferences)

    envs.push({name: "CONTROL_VERSION", value: version})
    labels.push({name: "com.docker.stack.namespace", value: stack})

    let dockerService = {
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
                /* "Hosts": [
                     "10.10.10.10 host1",
                     "ABCD:EF01:2345:6789:ABCD:EF01:2345:6789 host2"
                 ],*/
                /*"User": "33",*/
                /*  "DNSConfig": {
                      "Nameservers": [
                          "8.8.8.8"
                      ],
                      "Search": [
                          "example.org"
                      ],
                      "Options": [
                          "timeout:3"
                      ]
                  },*/
                /*"Secrets": [
                    {
                        "File": {
                            "Name": "www.example.org.key",
                            "UID": "33",
                            "GID": "33",
                            "Mode": 384
                        },
                        "SecretID": "fpjqlhnwb19zds35k8wn80lq9",
                        "SecretName": "example_org_domain_key"
                    }
                ]*/
            },
            /*"LogDriver": {
                "Name": "json-file",
                "Options": {
                    "max-file": "3",
                    "max-size": "10M"
                }
            },*/
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
        EndpointSpec: {
            Ports: ports.map(p => ({
                Protocol: "tcp",
                PublishedPort: parseInt(p.hostPort),
                TargetPort: parseInt(p.containerPort)
            }))
        },
        Labels: labels.reduce((obj, item) => {
            return {...obj, [item.name]: item.value,}
        }, {})

    }

    return dockerService
}

export const dockerServiceCreate = function (user, {name, stack, image, replicas = 1, volumes = [], ports = [], envs = [], labels = [], constraints = [], limits = {}, preferences = []}) {
    return new Promise(async (resolve, reject) => {
        try {
            if (user) {
                await createAudit(user, {user: user.id, action: 'CREATE', target: name})
            }

            const version = 1
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
                preferences
            })
            
            let result = await docker.createService(dockerServiceConfig)
            
            let inspect = await docker.getService(result.id).inspect()
            console.log(inspect)
            let service = mapInspectToServiceModel(inspect)
            console.log(service)

            resolve(service)

        } catch (e) {
            reject(e)
        }

    })
}


export const dockerServiceUpdate = function (user, serviceId, {name, stack, image, replicas = 1, volumes = [], ports = [], envs = [], labels = [], constraints = [], limits = {}, preferences = []}) {
    return new Promise(async (resolve, reject) => {
        try {

            if (user) {
                await createAudit(user, {user: user.id, action: 'CREATE', target: name})
            }

            let service = await docker.getService(serviceId)
            let serviceInspected = await service.inspect()
            let version = parseInt(serviceInspected.Version.Index)

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
                preferences
            })

            let result = await docker.getService(serviceId).update(dockerServiceConfig)

            let inspect = await docker.getService(serviceId).inspect()

            service = mapInspectToServiceModel(inspect)
            console.log(service)

            resolve(service)

        } catch (e) {
            reject(e)
        }

    })
}
