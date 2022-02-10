import express from 'express'
import {fetchService, findService, findServiceTag} from "../services/DockerService";


var router = express.Router();


router.get('/docker/service', async function (req, res) {
    let r = await fetchService()
    res.json(r)
})

router.get('/docker/service/:name', async function (req, res) {
   let r = await findService( req.params.name)
    res.json(r)
})

router.get('/docker/service/:name/tag', async function (req, res) {
    let r = await findServiceTag( req.params.name)
    res.json(r)
})

module.exports = router;
