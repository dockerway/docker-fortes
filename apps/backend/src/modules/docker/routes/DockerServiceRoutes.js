import express from 'express'
import {
    dockerServiceCreate,
    dockerServiceUpdate,
    fetchService,
    findServiceByIdOrName,
    findServiceTag
} from "../services/DockerService";
import http from "http";
import { serviceStats, serviceStatsByName } from "../services/DockerStatsService";
import { AuthenticationError, ForbiddenError } from 'apollo-server-express';
import { DOCKER_CREATE, DOCKER_UPDATE, DOCKER_VIEW } from '../permissions/dockerPermissions';


let router = express.Router();
router.use(express.json());

function validateStatusCode(statusCode){
    return http.STATUS_CODES.hasOwnProperty(statusCode)
}

router.get('/docker/service', async function (req, res) {
    try {
        if(!req.user)  throw new AuthenticationError("Usted no esta autenticado o su token es incorrecto")
        if(!req.rbac.isAllowed(req.user.id, DOCKER_VIEW)) throw new ForbiddenError("Not Authorized")

        res.json(await fetchService())
    } catch (error) {
        const statusCode = (error.statusCode && validateStatusCode(error.statusCode)) ? error.statusCode : 500
        res.status(statusCode).send(error.message)
    }
})


router.post('/docker/service', async function (req, res) {
    try {
        if (!req.user) throw new AuthenticationError("Usted no esta autenticado o su token es incorrecto")
        if (!req.rbac.isAllowed(req.user.id, DOCKER_CREATE)) throw new ForbiddenError("Not Authorized")

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

router.put('/docker/service/:service', async function (req, res) {
    try {
        if(!req.user)  throw new AuthenticationError("Usted no esta autenticado o su token es incorrecto")
        if(!req.rbac.isAllowed(req.user.id, DOCKER_UPDATE)) throw new ForbiddenError("Not Authorized")

        res.json(await dockerServiceUpdate(req.user, req.params.service, req.body))
    } catch (error) {
        const statusCode = (error.statusCode && validateStatusCode(error.statusCode)) ? error.statusCode : 500
        res.status(statusCode).send(error.message)
    }
})

router.get('/docker/service/:serviceIdentifier', async function (req, res) {
    try {
        if(!req.user)  throw new AuthenticationError("Usted no esta autenticado o su token es incorrecto")
        if(!req.rbac.isAllowed(req.user.id, DOCKER_VIEW)) throw new ForbiddenError("Not Authorized")

        res.json(await findServiceByIdOrName(req.params.serviceIdentifier))
    } catch (error) {
        res.status(error.message === "Service not found" ? 404 : 500).send(error.message)
    }
})

router.get('/docker/service/:name/tag', async function (req, res) {
    try {
        if(!req.user)  throw new AuthenticationError("Usted no esta autenticado o su token es incorrecto")
        if(!req.rbac.isAllowed(req.user.id, DOCKER_VIEW)) throw new ForbiddenError("Not Authorized")

        res.json(await findServiceTag(req.params.name))
    } catch (error) {
        const statusCode = (error.statusCode && validateStatusCode(error.statusCode)) ? error.statusCode : 500
        res.status(statusCode).send(error.message)
    }
})


router.get('/docker/service/:serviceName/stats', async function (req, res) {
    try {
        if (!req.user) throw new AuthenticationError("Usted no esta autenticado o su token es incorrecto")
        if (!req.rbac.isAllowed(req.user.id, DOCKER_VIEW)) throw new ForbiddenError("Not Authorized")

        res.json(await serviceStatsByName(req.params.serviceName))
    } catch (error) {
        const statusCode = (error.statusCode && validateStatusCode(error.statusCode)) ? error.statusCode : 500
        res.status(statusCode).send(error.message)
    }
})

router.get('/docker/service/id/:serviceId/stats', async function (req, res) {
    try {
        if(!req.user)  throw new AuthenticationError("Usted no esta autenticado o su token es incorrecto")
        if(!req.rbac.isAllowed(req.user.id, DOCKER_VIEW)) throw new ForbiddenError("Not Authorized")

        res.json(await serviceStats(req.params.serviceId))
    } catch (error) {
        const statusCode = (error.statusCode && validateStatusCode(error.statusCode)) ? error.statusCode : 500
        res.status(statusCode).send(error.message)
    }
})

module.exports = router;