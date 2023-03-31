import { createAudit } from "@dracul/audit-backend";
import Docker from "dockerode";

const docker = new Docker({ socketPath: "/var/run/docker.sock" })

export const createNetwork = async function (user, networkData) {
    try {
        const network = await docker.createNetwork(networkData)
        console.log('network: ', network)
        await createAudit(user, { user: user.id, action: "Create", resource: network.id, description: JSON.stringify(network) })

        return network
    } catch (error) {
        throw new Error(`Error creating Docker network: ${error.message}`)
    }
};

export const getNetwork = async function (networkIdentifier) {
    try {
        const network = await docker.getNetwork(networkIdentifier).inspect()

        return network
    } catch (error) {
        throw new Error(`Error getting Docker network '${networkIdentifier}': ${error.message}`)
    }
};

export const getOrCreateNetwork = async function (user, networkIdentifier) {
    try {
        const networkAlreadyExists = await getNetwork(networkIdentifier)
        if (!networkAlreadyExists) return (await createNetwork(user, networkIdentifier))
    } catch (error) {
        throw new Error(`An error happened while trying to getOrCreateNetwork '${networkIdentifier}': ${error.message}`)
    }
};

export const getNetworks = async function () {
    try {
        return await docker.listNetworks()
    } catch (error) {
        throw new Error(`Error getting all Docker networks '${networkId}': ${error.message}`)
    }
};

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

        await createAudit(user, { user: user.id, action: "Update", resource: network.name, description: JSON.stringify(result) })
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