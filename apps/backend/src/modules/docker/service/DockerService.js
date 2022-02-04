var Docker = require('dockerode');
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
            console.log("opts",opts)
            let data = await docker.listServices(opts)
            let services = data.map(item => ({name: item.Spec.Name, stack: getStackNameFromService(item)}))
            console.log("services",services)
            resolve(services)
        }catch (e) {
            reject(e)
        }

    })
}
