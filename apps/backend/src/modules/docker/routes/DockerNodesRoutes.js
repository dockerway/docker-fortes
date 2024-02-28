
import { requireAuthentication, requireAuthorization } from '@dracul/access-backend';
import { DefaultLogger as winston } from '@dracul/logger-backend';
import { fetchNode } from '../services/DockerNodeService';

import { DOCKER_NODES_FETCH } from '../permissions/dockerPermissions';
import { Router } from 'express';

export const NodesRouter = Router()

NodesRouter.get('/docker/nodes', [requireAuthentication, requireAuthorization([DOCKER_NODES_FETCH])], async function (req, res) {
    try {
        const allDockerNodes = await fetchNode()
        res.send(allDockerNodes)
    } catch (error) {
        winston.error(`An error happened at the GET all docker nodes endpoint: '${error}'`)
        res.status(500).send(error)
    }
})