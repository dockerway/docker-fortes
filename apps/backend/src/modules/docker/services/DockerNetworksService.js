import { createAudit } from "@dracul/audit-backend";
import Docker from "dockerode";

const docker = new Docker({ socketPath: "/var/run/docker.sock" })

export const createNetwork = async function (user, networkData) {
    try {
        console.log(`networkData: '${networkData}'`)
        const network = await docker.createNetwork(networkData)
        const networkInspect = JSON.stringify(await network.inspect())

        console.log(`created Network: '${networkInspect}'`)
        await createAudit(user, { user: user.id, action: "Create", resource: network.id, description: networkInspect })

        return network
    } catch (error) {
        throw new Error(`Error creating Docker network: ${error.message}`)
    }
}

export const getNetwork = async function (networkIdentifier) {
    try {
        return await docker.getNetwork(networkIdentifier).inspect()
    } catch (error) {
        if (error.message.includes('(HTTP code 404) no such network')) {
            return false
        } else {
            throw new Error(`Error getting Docker network '${networkIdentifier}': ${error.message}`)
        }
    }
}

export const getOrCreateNetwork = async function (user, networkIdentifier, label) {
    if(!user || !networkIdentifier || !label) throw new Error(`A needed parameter is missing`)

    console.log(`networkIdentifier: '${networkIdentifier}'`)
    console.log(`label: '${label}'`)

    try {
        const networkAlreadyExists = await getNetwork(networkIdentifier)
        const networkLabel = {"com.docker.stack.namespace": label}

        if (!networkAlreadyExists) return (await createNetwork(user, { Name: networkIdentifier, Driver: 'overlay', Labels: networkLabel }))
        if (networkAlreadyExists && networkAlreadyExists.Labels && networkAlreadyExists.Labels["com.docker.stack.namespace"] != label){
            await updateNetwork(user, networkIdentifier, {Labels : networkLabel})
        }

    } catch (error) {
        throw new Error(`An error happened while trying to getOrCreateNetwork '${networkIdentifier}': ${error.message}`)
    }
}

export const getNetworks = async function () {
    try {
        return await docker.listNetworks()
    } catch (error) {
        throw new Error(`Error getting all Docker networks: ${error.message}`)
    }
}

export const updateNetwork = async function (user, networkId, networkData) {
    try {
        if (!networkData || Object.keys(networkData).length < 1) throw new Error("You must provide the new network information!")

        const network = await docker.getNetwork(networkId).inspect()

        for (const key in networkData) {
            if (networkData.hasOwnProperty(key) && networkData[key] !== network[key]) {
                network[key] = networkData[key];
            }
        }

        await removeNetwork(user, networkId)
        const result = await createNetwork(user, network)

        await createAudit(user, { user: user.id, action: "Update", resource: networkId, description: JSON.stringify(result) })
        return result
    } catch (error) {
        throw new Error(`Error updating Docker network '${networkId}': ${error.message}`)
    }
}

export const removeNetwork = async function (user, networkId) {
    try {
        const result = await docker.getNetwork(networkId).remove()

        await createAudit(user, { user: user.id, action: "Remove", resource: networkId, description: JSON.stringify(result) })
        return result
    } catch (error) {
        throw new Error(`Error removing Docker network '${networkId}': ${error.message}`)
    }
}