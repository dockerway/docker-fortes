import { dnsTaskRunningByServiceAndNode } from "./DockerTaskService";
import { DefaultLogger as winston } from "@dracul/logger-backend";
import { fetchNode } from './DockerNodeService';
import axios from "axios";

export const foldersCreator = async function (volumes) {
    try {
        const DEFAULT_AGENT_SERVICE_NAME = "dockerway_incatainer-agent"
        const agentServiceName = process.env.AGENT_SERVICE_NAME ? process.env.AGENT_SERVICE_NAME : DEFAULT_AGENT_SERVICE_NAME

        const nodes = await fetchNode()

        let successCounter = 0

        let neededDirectoriesAreMountedInFortesAgent = null
        const notMountedMessage = 'The needed directories are not mounted; please contact your infrastructure team!' //has to match the agent's notMountedMessage

        for (let i = 0; i < nodes.length; i++) {
            try {
                const baseURL = "http://" + await dnsTaskRunningByServiceAndNode(agentServiceName, nodes[i].id)
                const path = '/api/docker/folders'

                const URL = baseURL + path
                const response = await axios.post(URL, volumes)

                winston.info(`agent folders endpoint response: '${JSON.stringify(response.data)}'`)

                if (response.data.response == notMountedMessage) {
                    neededDirectoriesAreMountedInFortesAgent = false
                }else if (response.status == 200) {
                    successCounter += 1
                    neededDirectoriesAreMountedInFortesAgent = true
                }

            } catch (error) {
                winston.error("ERROR foldersCreator node: " + JSON.stringify(nodes[i]), error)
            }

            winston.info("Nodes created successfully: " + successCounter + "/" + nodes.length)
        }

        return (neededDirectoriesAreMountedInFortesAgent) ? { nodes: nodes.length, success: successCounter } : notMountedMessage
    } catch (error) {
        throw (error)
    }
}