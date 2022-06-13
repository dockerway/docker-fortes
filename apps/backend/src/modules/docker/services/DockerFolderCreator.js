import createDirIfDoesntExist from '../helpers/createDirIfDoesntExist'
const Docker = require('dockerode');
var docker = new Docker({socketPath: '/var/run/docker.sock'});
import { fetchNode } from './DockerNodeService'
import { dnsTaskRunningByServiceAndNode } from "./DockerTaskService";
import axios from "axios";

export const foldersCreator = function () {
    return new Promise(async (resolve, reject) => {
        try {
            //dnsTaskRunningByServiceAndNode DockerStackService.js
            //if(!Array.isArray(req.body)) throw new Error("Request body must be an Array!")

            let volumes = {
                paths: "/probando/prueba"
            }

            const DEFAULT_AGENT_SERVICE_NAME = "dockerway_incatainer-agent"
            const agentServiceName = process.env.AGENT_SERVICE_NAME ? process.env.AGENT_SERVICE_NAME : DEFAULT_AGENT_SERVICE_NAME

            let nodes = await fetchNode()
            let path = '/api/docker/folders'
            console.log("NODES: ",nodes)
            console.log("NODES LENGTH: ",nodes.length)

            for(let i = 0; i < nodes.length; i++){
                //if(!req.body[i].path) throw new Error("One of the properties of the file is not defined.")
                let baseURL = "http://"+ await dnsTaskRunningByServiceAndNode(agentServiceName, nodes[i].id)
                let URL = baseURL + path
                console.log("remoteContainerStats URL Stats FINAL", URL)
                let response = await axios.post(URL, volumes)
                console.log("remoteContainerStats: ", response.data)
                if (response.status = 200) {
                    resolve(response.data)
                }else{
                    reject(new Error(response.data))
                }
                //createDirIfDoesntExist(req.body[i].path) create the directory
            }

            resolve("Paths created successfully!")
        } catch (e) {
            reject(e)
        }
    })
}