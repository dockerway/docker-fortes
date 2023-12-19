import express from 'express'
import http from "http";
import { requireAuthentication, requireAuthorization } from '@dracul/access-backend';
import { DOCKER_CREATE, DOCKER_REMOVE, DOCKER_UPDATE, DOCKER_VIEW } from '../permissions/dockerPermissions';
import { serviceStats, serviceStatsByName } from "../services/DockerStatsService";
import { dockerRemove } from '../services/DockerManageService';
import {
    dockerServiceCreate,
    dockerServiceUpdate,
    fetchService,
    findServiceByIdOrName,
    findServiceTag
} from "../services/DockerService";


let router = express.Router()
router.use(express.json())

function validateStatusCode(statusCode) {
    return http.STATUS_CODES.hasOwnProperty(statusCode)
}

router.get('/docker/service',[requireAuthentication, requireAuthorization([DOCKER_VIEW])],async function (req, res) {
    try {
        res.json(await fetchService())
    } catch (error) {
        const statusCode = (error.statusCode && validateStatusCode(error.statusCode)) ? error.statusCode : 500
        res.status(statusCode).send(error.message)
    }
})

router.post('/docker/service',[requireAuthentication, requireAuthorization([DOCKER_CREATE])],async function (req, res) {
    try {
        res.json(await dockerServiceCreate(req.user, req.body))
    } catch (error) {
        const statusCode = (error.statusCode && validateStatusCode(error.statusCode)) ? error.statusCode : 500

        if (error.message.includes('Service already exists')) {
            try {
                const existentServiceID = error.message.match(/[a-z0-9]{25}/)[0]
                res.json(await dockerServiceUpdate(req.user, existentServiceID, req.body))
            } catch (error) {
                res.status(statusCode).send(`The service already existed and an error happened when we tried to update it: '${error.message}'`)
            }
        } else {
            res.status(statusCode).send(error.message)
        }
    }
})

router.put('/docker/service/:service',[requireAuthentication, requireAuthorization([DOCKER_UPDATE])],async function (req, res) {
    try {
        res.json(await dockerServiceUpdate(req.user, req.params.service, req.body))
    } catch (error) {
        const statusCode = (error.statusCode && validateStatusCode(error.statusCode)) ? error.statusCode : 500
        res.status(statusCode).send(error.message)
    }
})

router.delete('/docker/service/:service', [requireAuthentication, requireAuthorization([DOCKER_REMOVE])], async function (req, res) {
    try {
        const serviceRemovalResult = await dockerRemove(req.user, req.params.service)
        res.send(serviceRemovalResult).status(200)
    } catch (error) {
        winston.error(`An error happened at the service delete endpoint: '${error}'`)
        res.status(500).send(error.message)
    }
})


router.get('/docker/service/:serviceIdentifier',[requireAuthentication, requireAuthorization([DOCKER_VIEW])], async function (req, res) {
    try {
        res.json(await findServiceByIdOrName(req.params.serviceIdentifier))
    } catch (error) {
        res.status(error.message === "Service not found" ? 404 : 500).send(error.message)
    }
})

router.get('/docker/service/:name/tag',[requireAuthentication, requireAuthorization([DOCKER_VIEW])], async function (req, res) {
    try {
        res.json(await findServiceTag(req.params.name))
    } catch (error) {
        const statusCode = (error.statusCode && validateStatusCode(error.statusCode)) ? error.statusCode : 500
        res.status(statusCode).send(error.message)
    }
})


router.get('/docker/service/:serviceName/stats', [requireAuthentication, requireAuthorization([DOCKER_VIEW])], async function (req, res) {
    try {
        res.json(await serviceStatsByName(req.params.serviceName))
    } catch (error) {
        const statusCode = (error.statusCode && validateStatusCode(error.statusCode)) ? error.statusCode : 500
        res.status(statusCode).send(error.message)
    }
})

router.get('/docker/service/id/:serviceId/stats',[requireAuthentication, requireAuthorization([DOCKER_VIEW])], async function (req, res) {
    try {
        res.json(await serviceStats(req.params.serviceId))
    } catch (error) {
        const statusCode = (error.statusCode && validateStatusCode(error.statusCode)) ? error.statusCode : 500
        res.status(statusCode).send(error.message)
    }
})

module.exports = router;