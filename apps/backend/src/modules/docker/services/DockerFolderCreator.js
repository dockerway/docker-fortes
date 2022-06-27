import { fetchNode } from './DockerNodeService'
import { dnsTaskRunningByServiceAndNode } from "./DockerTaskService";
import axios from "axios";
import { DefaultLogger as winston} from "@dracul/logger-backend"

export const foldersCreator = function (volumes) {
    return new Promise(async (resolve, reject) => {
        try {
            const DEFAULT_AGENT_SERVICE_NAME = "dockerway_incatainer-agent"
            const agentServiceName = process.env.AGENT_SERVICE_NAME ? process.env.AGENT_SERVICE_NAME : DEFAULT_AGENT_SERVICE_NAME

            let nodes = await fetchNode()
            let path = '/api/docker/folders'
            let successCounter = 0

            for(let i = 0; i < nodes.length; i++){
                try {
                    let baseURL = "http://"+ await dnsTaskRunningByServiceAndNode(agentServiceName, nodes[i].id)
                    let URL = baseURL + path
                    let response = await axios.post(URL, volumes)
                    if(response.status == 200) successCounter++
                } catch(e){
                    winston.error("ERROR foldersCreator node: " + nodes[i], e)
                }
            }

            winston.info("Nodes created successfully: " + successCounter + "/" + nodes.length)
            resolve({ nodes: nodes.length, success: successCounter })
        } catch (e) {
            reject(e)
        }
    })
}