const Docker = require('dockerode');
var docker = new Docker({socketPath: '/var/run/docker.sock'});

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
