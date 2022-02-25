import {createAudit} from "./AuditService";

const Docker = require('dockerode');
var docker = new Docker({socketPath: '/var/run/docker.sock'});
import dayjs from 'dayjs'
import getImageObject from "./helpers/getImageObject";



function getStackNameFromService(service) {
    return service?.Spec?.Labels["com.docker.stack.namespace"]
}






export const findServiceTag = function (name) {

    return new Promise(async (resolve, reject) => {

        try{
            let service = await findService(name)
            resolve(service.image.tag)

        }catch (e) {
            reject(e)
        }

    })

}

export const findService = function (name) {
    return new Promise(async (resolve, reject) => {
        try {

            let opts = {}
            if (name) {
                opts = {
                    filters: JSON.stringify({"name": [name]})
                };
            }
            //console.log("opts",opts)
            let data = await docker.listServices(opts)

            let service
            if (data) {
                console.log("Service Data", JSON.stringify(data, null, 4))
                if( data.length === 1){
                    let item = data[0]
                    service = {
                        id: item?.ID,
                        name: item?.Spec?.Name,
                        stack: getStackNameFromService(item),
                        image: getImageObject(item.Spec.TaskTemplate.ContainerSpec.Image),
                        createdAt: item?.CreatedAt,
                        updatedAt: item?.UpdatedAt,
                        ports: item?.Spec?.EndpointSpec?.Ports?.map(p => ({
                            containerPort: p?.TargetPort,
                            hostPort: p?.PublishedPort,
                            protocol: p?.Protocol
                        })),
                        volumes: item?.Spec?.TaskTemplate?.ContainerSpec?.Mounts?.map(m => ({
                            containerVolume: m?.Target,
                            hostVolume: m?.Source,
                            type: m?.Type
                        })),
                        labels: (item?.Spec?.TaskTemplate?.ContainerSpec?.Labels) ? Object.entries(item?.Spec?.TaskTemplate?.ContainerSpec?.Labels).map(l => ({
                            name: l[0],
                            value: l[1],
                        })) : [],
                        envs: item?.Spec?.TaskTemplate?.ContainerSpec?.Env?.map(e => ({
                            name: e.split("=")[0],
                            value: e.split("=")[1],
                        })),
                    }
                    resolve(service)
                }else if( data.length === 0){
                    reject("Service not found")
                }else if( data.length > 1){
                    reject("Multiple match. Refine filter name")
                }else{
                    reject("Service not found")
                }

            }else{
                reject("Service not found")
            }
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
            let services = data.map(
                item => ({
                    id: item?.ID,
                    name: item?.Spec?.Name,
                    stack: getStackNameFromService(item),
                    image: getImageObject(item.Spec.TaskTemplate.ContainerSpec.Image),
                    createdAt: item?.CreatedAt,
                    updatedAt: item?.UpdatedAt,
                    ports: item?.Spec?.EndpointSpec?.Ports?.map(p => ({
                        containerPort: p?.TargetPort,
                        hostPort: p?.PublishedPort,
                        protocol: p?.Protocol
                    })),
                    volumes: item?.Spec?.TaskTemplate?.ContainerSpec?.Mounts?.map(m => ({
                        containerVolume: m?.Target,
                        hostVolume: m?.Source,
                        type: m?.Type
                    })),
                    labels: (item?.Spec?.TaskTemplate?.ContainerSpec?.Labels) ? Object.entries(item?.Spec?.TaskTemplate?.ContainerSpec?.Labels).map(l => ({
                        name: l[0],
                        value: l[1],
                    })) : [],
                    envs: item?.Spec?.TaskTemplate?.ContainerSpec?.Env?.map(e => ({
                        name: e.split("=")[0],
                        value: e.split("=")[1],
                    })),
                }))
            //console.log("services",services)
            resolve(services)
        } catch (e) {
            reject(e)
        }

    })
}



export const dockerServiceCreate = function (user, {name, image, replicas = 1, volumes = [], ports = [], envs = [], labels = []}) {
    return new Promise(async (resolve, reject) => {
        try {

            if(user){
                await createAudit(user, {user: user.id, action: 'CREATE', target: name})
            }

            let dockerService = {
                Name: name,
                TaskTemplate: {
                    ContainerSpec: {
                        Image: image,
                        Mounts: volumes.map(v => (
                            {
                                Source:v.hostVolume,
                                Target: v.containerVolume,
                                Type: "bind"
                            })),
                        Env: envs.map(e => e.name+"="+e.value)
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
                    },
                    "Placement": {},*/
                   /* "Resources": {
                        "Limits": {
                            "MemoryBytes": 104857600
                        },
                        "Reservations": {}
                    },*/
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
                Labels: labels.reduce((obj, item) => {return {...obj, [item.name]: item.value,}}, {})

            }

            let opts = JSON.stringify(dockerService)

            console.log("OPTS",opts)

            let data = await docker.createService(dockerService)

            console.log(data)

            let service = await findService(name)
            resolve(service)

        } catch (e) {
            reject(e)
        }

    })
}
