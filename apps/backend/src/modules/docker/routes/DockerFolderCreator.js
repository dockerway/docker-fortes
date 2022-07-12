import express from 'express'
import { foldersCreator } from '../services/DockerFolderCreator'
import { DOCKER_UPDATE } from '../permissions/dockerPermissions';

var router = express.Router();

router.post('/docker/folders', async function (req, res) {
    try {
        const user = req.user;
        if(!user)  throw new AuthenticationError("Usted no esta autenticado o su token es incorrecto");
        if(!req.rbac.isAllowed(user.id, DOCKER_UPDATE)) throw new ForbiddenError("Not Authorized");
        
        if(!Array.isArray(req.body.volumes)) throw new Error("Request body must be an Array!")
        let r = await foldersCreator(req.body)
        res.status(200)
        res.json(r)
    } catch(e){
        console.error("Error DockerFolderCreator: ",e)
        res.status(500)
        res.send(e.message)
    }
})

module.exports = router;