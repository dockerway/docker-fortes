import { fetchTasksByNodeId } from './DockerTaskService'

const Docker = require('dockerode');
var docker = new Docker({socketPath: '/var/run/docker.sock'});

export const findNode = function (id = '') {
    return new Promise(async (resolve, reject) => {
        try {

            const data = await docker.getNode(id)
            const item = await data.inspect()

            // console.log("Nodes Data", JSON.stringify(item, null, 4))

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

            //console.log("node", node)
            resolve(node)
        } catch (error) {
            error.message.includes('no such node') ? resolve('Node not found') : reject(e)
        }

    })
}

export const fetchNodeAndTasks = async function () {
    return new Promise(async (resolve, reject) => {
        try {

            let opts = {}

            let data = await docker.listNodes(opts)

            const nodes = []

            for(let doc of data){
                const fetchTasksByNodeIdData = await fetchTasksByNodeId(doc.ID)
                nodes.push({
                    id: doc.ID,
                    hostname: doc?.Description?.Hostname,
                    ip: doc?.Status?.Addr,
                    role: doc?.Spec?.Role,
                    availability: doc?.Spec?.Availability,
                    state: doc?.Status?.State,
                    engine: doc?.Description?.Engine?.EngineVersion,
                    leader: doc?.ManagerStatus?.Leader,
                    reachability: doc?.ManagerStatus?.Reachability,
                    resources: doc?.Description?.Resources,
                    labels: doc?.Spec?.Labels,
                    tasks: fetchTasksByNodeIdData
                })
            }
            resolve(nodes)
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
                    reachability: item?.ManagerStatus?.Reachability,
                    resources: item?.Description?.Resources
                })
            )
            // console.log("nodes", nodes)
            resolve(nodes)
        } catch (e) {
            reject(e)
        }

    })
}

