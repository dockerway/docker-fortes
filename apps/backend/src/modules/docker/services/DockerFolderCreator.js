import createDirIfDoesntExist from '../helpers/createDirIfDoesntExist'
const Docker = require('dockerode');
var docker = new Docker({socketPath: '/var/run/docker.sock'});
import { fetchNode } from './DockerNodeService'
import { dnsTaskRunningByServiceAndNode } from "./DockerTaskService";
import axios from "axios";

export const foldersCreator = function (volumes) {
    return new Promise(async (resolve, reject) => {
        try {
            const DEFAULT_AGENT_SERVICE_NAME = "dockerway_incatainer-agent"
            const agentServiceName = process.env.AGENT_SERVICE_NAME ? process.env.AGENT_SERVICE_NAME : DEFAULT_AGENT_SERVICE_NAME

            let nodes = await fetchNode()
            let path = '/api/docker/folders'

            for(let i = 0; i <= nodes.length; i++){
                let baseURL = "http://"+ await dnsTaskRunningByServiceAndNode(agentServiceName, nodes[i].id)
                let URL = baseURL + path
                let response = await axios.post(URL, volumes)
                if (response.status = 200) {
                    resolve(response.data)
                }else{
                    reject(new Error(response.data))
                }
            }

            resolve("Paths created successfully!")
        } catch (e) {
            reject(e)
        }
    })
}