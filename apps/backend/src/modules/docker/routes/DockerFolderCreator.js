import express from 'express'
import { foldersCreator } from '../services/DockerFolderCreator'

var router = express.Router();

router.post('/docker/folders', async function (req, res) {
    try {
        if(!Array.isArray(req.body)) throw new Error("Request body must be an Array!")
        let res = await foldersCreator(req.body)
        res.status(200)
        res.json(res)
    } catch(e){
        console.error("Error DockerFolderCreator: ",e)
        res.status(500)
        res.send(e.message)
    }
})

module.exports = router;