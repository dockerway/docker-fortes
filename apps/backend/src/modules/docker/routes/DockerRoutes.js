import express from 'express'
import {
    dockerServiceCreate,
    dockerServiceUpdate,
    fetchService,
    findService,
    findServiceTag
} from "../services/DockerService";


var router = express.Router();


router.get('/docker/service', async function (req, res) {
    try {
        let r = await fetchService()
        res.json(r)

    } catch (e) {
        res.status(e.code)
        res.send(e.message)
    }
})


router.post('/docker/service', async function (req, res) {
    try {
        let user = null
        let body = req.body

        let r = await dockerServiceCreate(null, body)
        res.json(r)
    } catch (e) {
        console.log(e)
        res.status(e.statusCode ? e.statusCode : 500)
        res.send(e.message)
    }

})

router.put('/docker/service/:service', async function (req, res) {
    try {
        let user = null
        let body = req.body
        let serviceId = req.params.service

        let r = await dockerServiceUpdate(null, serviceId, body)
        res.json(r)
    } catch (e) {
        console.log(e)
        res.status(e.statusCode ? e.statusCode : 500)
        res.send(e.message)
    }

})

router.get('/docker/service/:name', async function (req, res) {
    try {
        let r = await findService(req.params.name)
        res.json(r)

    } catch (e) {
        res.status(e.code)
        res.send(e.message)
    }
})

router.get('/docker/service/:name/tag', async function (req, res) {
    try {
        let r = await findServiceTag(req.params.name)
        res.json(r)

    } catch (e) {
        res.status(e.code)
        res.send(e.message)
    }
})

module.exports = router;
