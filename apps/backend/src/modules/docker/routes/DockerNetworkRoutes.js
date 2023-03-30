import express from 'express';
import { AuthenticationError, ForbiddenError } from 'apollo-server-express';
import { DOCKER_NETWORK_CREATE, DOCKER_NETWORK_UPDATE, DOCKER_NETWORK_VIEW } from '../permissions/dockerPermissions';
import { createNetwork, updateNetwork, getNetworks, getNetwork, removeNetwork } from '../services/DockerNetworksService';

const router = express.Router()
router.use(express.json())

router.get('/docker/network/:network', async function (req, res) {
    try {
        if (!req.user) throw new AuthenticationError('Usted no esta autenticado o su token es incorrecto')
        if (!req.rbac.isAllowed(req.user.id, DOCKER_NETWORK_VIEW)) throw new ForbiddenError('Not Authorized')

        res.json(await getNetwork(req.params.network))
    } catch (error) {
        res.send(error.message)
    }
})

router.get('/docker/networks', async function (req, res) {
    try {
        if (!req.user) throw new AuthenticationError('Usted no esta autenticado o su token es incorrecto')
        if (!req.rbac.isAllowed(req.user.id, DOCKER_NETWORK_VIEW)) throw new ForbiddenError('Not Authorized')

        res.json(await getNetworks())
    } catch (error) {
        res.status(500).send(error.message)
    }
})



router.post('/docker/network', async function (req, res) {
    try {
        if (!req.user) throw new AuthenticationError('Usted no esta autenticado o su token es incorrecto')
        if (!req.rbac.isAllowed(req.user.id, DOCKER_NETWORK_CREATE)) throw new ForbiddenError('Not Authorized')

        res.json(await createNetwork(req.user, req.body))
    } catch (error) {
        res.send(error.message)
    }
})

router.put('/docker/network/:network', async function (req, res) {
    try {
        if (!req.user) throw new AuthenticationError('Usted no esta autenticado o su token es incorrecto')
        if (!req.rbac.isAllowed(req.user.id, DOCKER_NETWORK_UPDATE)) throw new ForbiddenError('Not Authorized')

        res.json(await updateNetwork(req.user, req.params.network, req.body))
    } catch (error) {
        res.send(error.message)
    }
})

router.delete('/docker/network/:network', async function (req, res){
    try {
        const deletedNetworkResult = await removeNetwork(req.user, req.params.network)
        res.status(200).json(deletedNetworkResult)
    } catch (error) {
        res.status(500).send(error.message)
    }
})

module.exports = router;
