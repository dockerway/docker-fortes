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

function getStackNameFromService(service) {
    return service?.Spec?.Labels["com.docker.stack.namespace"]
}

function getImageObject(inputImage = '') {
    //console.log(inputImage)

    let fullname = /@/.test(inputImage) ? inputImage.split("@")[0] : inputImage
    let imageSplited = fullname.split("/")

    let id = /@/.test(inputImage) ? inputImage.split("@")[1].split(":")[1] : ''
    let name = ''
    let namespace = ''
    let domain = ''
    let tag = ''

    switch (imageSplited.length) {
        case 1:
            name = imageSplited[0]
            break;
        case 2:
            name = imageSplited[1]
            domain = imageSplited[0]
            break;
        case 3:
            name = imageSplited[2]
            namespace = imageSplited[1]
            domain = imageSplited[0]
            break;

    }

    tag = /:/.test(name) ? name.split(":")[1] : ""


    let obj = {
        id: id,
        fullname: fullname,
        name: name,
        namespace: '',
        domain: domain,
        tag: tag
    }

    return obj
}

export const fetchStack = function () {
    return new Promise(async (resolve, reject) => {
        try {
            let services = await docker.listServices()
            let stacks = []

            for (let service of services) {
                if (service?.Spec?.Labels["com.docker.stack.namespace"]) {
                    let name = getStackNameFromService(service)
                    let stack = stacks.find(s => s.name === name)
                    if (stack) {
                        stack.services++
                    } else {
                        stacks.push({name, services: 1})
                    }
                }
            }
            console.log("stacks", stacks)
            resolve(stacks)
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
                    ports: item?.Endpoint?.Ports?.map(p => ({
                        targetPort: p?.TargetPort,
                        publishedPort: p?.PublishedPort,
                        protocol: p?.Protocol
                    }))
                }))
            //console.log("services",services)
            resolve(services)
        } catch (e) {
            reject(e)
        }

    })
}


export const fetchContainer = function (service) {
    return new Promise(async (resolve, reject) => {
        try {

            let opts = {}
            if (service) {
                opts = {
                    filters: JSON.stringify({"label": ["com.docker.swarm.service.id=" + service]})
                };
            }
            console.log("opts",opts)
            let data = await docker.listContainers(opts)

            console.log("Containers Data", JSON.stringify(data, null,4))

            let containers = data.map(
                item => ({
                    id: item?.Id,
                    name: item?.Names[0],
                    task: item?.Names[0].split(".")[2],
                    nodeId: item.Labels["com.docker.swarm.node.id"],
                    image: getImageObject(item?.Image),
                    command: item?.Command,
                    createdAt: item?.Created,
                    state: item?.State,
                    status: item?.Status,
                    labels: Object.entries(item.Labels).map(i => ({key: i[0], value: i[1]}))
                })
            )
            console.log("containers",containers)
            resolve(containers)
        } catch (e) {
            reject(e)
        }

    })
}

export const fetchTask= function (service) {
    return new Promise(async (resolve, reject) => {
        try {

            let opts = {}
            if (service) {
                opts = {
                    filters: JSON.stringify({"service": [service]})
                };
            }
            console.log("opts",opts)
            let data = await docker.listTasks(opts)

            //console.log("Task Data", JSON.stringify(data, null,4))

            let containers = data.map(
                item => ({
                    id: item?.ID,
                    nodeId: item.NodeID,
                    createdAt: item?.CreatedAt,
                    updatedAt: item?.UpdatedAt,
                    state:  item?.Status?.State,
                    message:  item?.Status?.Message,
                    image: getImageObject(item?.Spec?.ContainerSpec?.Image),
                    serviceId: item?.ServiceID,
                    containerId: item?.Status?.ContainerStatus?.ContainerID,
                    //labels: Object.entries(item.Labels).map(i => ({key: i[0], value: i[1]}))
                })
            )
            console.log("tasks",containers)
            resolve(containers)
        } catch (e) {
            reject(e)
        }

    })
}

export const fetchNode = function (role = '') {
    return new Promise(async (resolve, reject) => {
        try {

            let opts = {}
            if (role) {
                opts = {
                    //filters: JSON.stringify({"label": ["com.docker.swarm.service.name=" + service]})
                };
            }
            //console.log("opts",opts)
            let data = await docker.listNodes(opts)

            //console.log("Nodes Data", JSON.stringify(data, null, 4))

            let nodes = data.map(
                item => ({
                    id: item.ID,
                    hostname: item?.Description?.Hostname,
                    ip: item?.Status?.Addr,
                    role: item?.Spec?.Role,
                    availability: item?.Spec?.Availability,
                    state: item?.Status?.State,
                    engine: item?.Description?.Engine?.EngineVersion,
                    leader: item?.ManagerStatus?.Leader,
                    reachability: item?.ManagerStatus?.Reachability

                })
            )
           // console.log("nodes", nodes)
            resolve(nodes)
        } catch (e) {
            reject(e)
        }

    })
}

export const findNode = function (id = '') {
    return new Promise(async (resolve, reject) => {
        try {

            let data = await docker.getNode(id)

            let item = await data.inspect()

            console.log("Nodes Data", JSON.stringify(item, null, 4))

            let node = {
                    id: item.ID,
                    hostname: item?.Description?.Hostname,
                    ip: item?.Status?.Addr,
                    role: item?.Spec?.Role,
                    availability: item?.Spec?.Availability,
                    state: item?.Status?.State,
                    engine: item?.Description?.Engine?.EngineVersion,
                    leader: item?.ManagerStatus?.Leader,
                    reachability: item?.ManagerStatus?.Reachability
                }

            console.log("node", node)
            resolve(node)
        } catch (e) {
            reject(e)
        }

    })
}

export const serviceLogs = function (service, tail = 100) {
    return new Promise(async (resolve, reject) => {
        try {

            console.log("service", service)

            let filters = {
                stdout: true,
                stderr: true,
                since: 0,
                timestamps: true,
                tail: tail
            }

            let logs = await docker.getService(service).logs(filters)

            logs = logs.toString('utf8').replace(/\u0000|\u0002/g, "").replace(/�/g, "").split('\n')

            logs = logs.map(log => ({
                timestamp: log.substring(0, 30),
                text: log.substring(31)
            })).filter(log => log.text)

            resolve(logs)
        } catch (e) {
            reject(e)
        }

    })
}


