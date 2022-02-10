import express from 'express'
import {fetchService, findService} from "../services/DockerService";


var router = express.Router();


router.get('/docker/service', async function (req, res) {
    let r = await fetchService()
    res.json(r)
})

router.get('/docker/service/:name', async function (req, res) {
   let r = await findService( req.params.name)
    res.json(r)
})

module.exports = router;
