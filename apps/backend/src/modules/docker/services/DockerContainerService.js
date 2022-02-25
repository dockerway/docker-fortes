import getImageObject from "./helpers/getImageObject";

const Docker = require('dockerode');
var docker = new Docker({socketPath: '/var/run/docker.sock'});

export const fetchContainer = function (service) {
    return new Promise(async (resolve, reject) => {
        try {

            let opts = {}
            if (service) {
                opts = {
                    filters: JSON.stringify({"label": ["com.docker.swarm.service.id=" + service]})
                };
            }
            console.log("opts", opts)
            let data = await docker.listContainers(opts)

            console.log("Containers Data", JSON.stringify(data, null, 4))

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
            console.log("containers", containers)
            resolve(containers)
        } catch (e) {
            reject(e)
        }

    })
}
