import express from 'express'
import { foldersCreator } from '../services/DockerFolderCreator'

var router = express.Router();

router.post('/docker/folders', async function (req, res) {
    try {
        if(!Array.isArray(req.body)) throw new Error("Request body must be an Array!")
        let r = await foldersCreator(req.body)
        res.json(r)
    } catch(e){
        console.error("Error DockerFolderCreator: ",e)
        res.status(500)
        res.send(e.message)
    }
})

module.exports = router;