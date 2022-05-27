import express from 'express'
import {
    dockerServiceCreate,
    dockerServiceUpdate,
    fetchService,
    findServiceByName,
    findServiceTag
} from "../services/DockerService";
import http from "http";
import {serviceStats, serviceStatsByName, taskStats} from "../services/DockerStatsService";
import { AuthenticationError, ForbiddenError } from 'apollo-server-express';
import { DOCKER_CREATE, DOCKER_UPDATE } from '../permissions/dockerPermissions';


var router = express.Router();

function validateStatusCode(statusCode){
    return http.STATUS_CODES.hasOwnProperty(statusCode)
}

router.get('/docker/service', async function (req, res) {
    try {
        let r = await fetchService()
        res.json(r)

    } catch (e) {
        let statusCode = (e.statusCode && validateStatusCode(e.statusCode)) ? e.statusCode : 500
        res.status(statusCode)
        res.send(e.message)
    }
})


router.post('/docker/service', async function (req, res) {
    try {
        let user = req.user
        if(!user)  throw new AuthenticationError("Usted no esta autenticado o su token es incorrecto")
        if(!req.rbac.isAllowed(user.id, DOCKER_CREATE)) throw new ForbiddenError("Not Authorized")

        let body = req.body

        let r = await dockerServiceCreate(user, body)
        res.json(r)
    } catch (e) {
        let statusCode = (e.statusCode && validateStatusCode(e.statusCode)) ? e.statusCode : 500
        res.status(statusCode)
        res.send(e.message)
    }

})

router.put('/docker/service/:service', async function (req, res) {
    try {
        let user = req.user
        if(!user)  throw new AuthenticationError("Usted no esta autenticado o su token es incorrecto")
        if(!req.rbac.isAllowed(user.id, DOCKER_UPDATE)) throw new ForbiddenError("Not Authorized")

        let body = req.body
        let serviceId = req.params.service

        let r = await dockerServiceUpdate(user, serviceId, body)
        res.json(r)
    } catch (e) {
        let statusCode = (e.statusCode && validateStatusCode(e.statusCode)) ? e.statusCode : 500
        res.status(statusCode)
        res.send(e.message)
    }

})

router.get('/docker/service/:name', async function (req, res) {
    try {
        let r = await findServiceByName(req.params.name)
        res.json(r)

    } catch (e) {
        res.status(e.message === "Service not found" ? 404 : 500)
        res.send(e.message)
    }
})

router.get('/docker/service/:name/tag', async function (req, res) {
    try {
        let r = await findServiceTag(req.params.name)
        res.json(r)

    } catch (e) {
        let statusCode = (e.statusCode && validateStatusCode(e.statusCode)) ? e.statusCode : 500
        res.status(statusCode)
        res.send(e.message)
    }
})


router.get('/docker/service/:serviceName/stats', async function (req, res) {
    try {
        let r = await serviceStatsByName(req.params.serviceName)
        res.json(r)

    } catch (e) {
        let statusCode = (e.statusCode && validateStatusCode(e.statusCode)) ? e.statusCode : 500
        res.status(statusCode)
        res.send(e.message)
    }
})

router.get('/docker/service/id/:serviceId/stats', async function (req, res) {
    try {
        let r = await serviceStats(req.params.serviceId)
        res.json(r)

    } catch (e) {
        let statusCode = (e.statusCode && validateStatusCode(e.statusCode)) ? e.statusCode : 500
        res.status(statusCode)
        res.send(e.message)
    }
})

module.exports = router;
