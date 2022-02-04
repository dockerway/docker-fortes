const Docker = require('dockerode');
var docker = new Docker({socketPath: '/var/run/docker.sock'});


export const dockerVersion =  function (id) {
    return new Promise(async (resolve, reject) => {
        try{
            let version = await docker.version()
            console.log("the version",version)
            resolve(version)
        }catch (e) {
            reject(e)
        }

    })
}

function getStackNameFromService(service){
    return service?.Spec?.Labels["com.docker.stack.namespace"]
}

export const fetchStack =  function () {
    return new Promise(async (resolve, reject) => {
        try{
            let services = await docker.listServices()
            let stacks = []

            for(let service of services){
                if(service?.Spec?.Labels["com.docker.stack.namespace"]){
                    let name = getStackNameFromService(service)
                    let stack = stacks.find(s => s.name === name)
                    if(stack){
                        stack.services++
                    }else{
                        stacks.push({name, services: 1})
                    }
                }
            }
            console.log("stacks",stacks)
            resolve(stacks)
        }catch (e) {
            reject(e)
        }

    })
}


export const fetchService =  function (stack) {
    return new Promise(async (resolve, reject) => {
        try{

            let opts = {}
            if(stack){
                opts = {
                    filters: JSON.stringify({ "label": ["com.docker.stack.namespace="+stack]})
                };
            }
            //console.log("opts",opts)
            let data = await docker.listServices(opts)
            let services = data.map(
                item => ({
                    id: item.ID,
                    name: item.Spec.Name,
                    stack: getStackNameFromService(item),
                    image: item.Spec.TaskTemplate.ContainerSpec.Image,
                    createdAt: item.CreatedAt,
                    updatedAt: item.UpdatedAt,
                    ports: item.Endpoint?.Ports?.map(p => ({
                        targetPort: p.TargetPort,
                        publishedPort: p.PublishedPort,
                        protocol: p.Protocol
                    }))
                }))
            //console.log("services",services)
            resolve(services)
        }catch (e) {
            reject(e)
        }

    })
}


export const fetchContainer =  function (service) {
    return new Promise(async (resolve, reject) => {
        try{

            let opts = {}
            if(service){
                opts = {
                    filters: JSON.stringify({ "name": [service]})
                };
            }
            //console.log("opts",opts)
            let data = await docker.listContainers(opts)

            console.log("Containers Data", JSON.stringify(data))

            let containers = data.map(
                item => ({
                    id: item.Id,
                    name: item.Names[0],
                    task: item.Names[0].split(".")[2],
                    nodeId: item.Labels["com.docker.swarm.node.id"],
                    image: item.Image,
                    command: item.Command,
                    createdAt: item.Created,
                    state: item.State,
                    status: item.Status
                    })
                )
            //console.log("containers",containers)
            resolve(containers)
        }catch (e) {
            reject(e)
        }

    })
}


export const serviceLogs =  function (service, tail = 100) {
    return new Promise(async (resolve, reject) => {
        try{

            console.log("service",service)

            let filters = {
                stdout: true,
                stderr: true,
                since: 0,
                timestamps: true,
                tail: tail
            }

            let logs = await docker.getService(service).logs(filters)

            logs = logs.toString('utf8').replace(/\u0000|\u0002/g,"").replace(/�/g,"").split('\n')

            logs = logs.map(log => ({timestamp: log.substring(0,30), text: log.substring(31)})).filter(log => log.text  )

            resolve(logs)
        }catch (e) {
            reject(e)
        }

    })
}

