import { foldersCreator } from '../services/DockerFolderCreator';
import { DOCKER_UPDATE } from '../permissions/dockerPermissions';
import express from 'express';


const router = express.Router()

router.post('/docker/folders', async function (req, res) {
    try {
        const user = req.user
        if (!user) throw new AuthenticationError("Usted no esta autenticado o su token es incorrecto")
        if (!req.rbac.isAllowed(user.id, DOCKER_UPDATE)) throw new ForbiddenError("Not Authorized")
        
        if (!Array.isArray(req.body) )throw new Error("Request body must be an Array!")

        const foldersCreatorResponse = await foldersCreator(req.body)
        console.log(`volumes: '${req.body}'`)

        res.status(200).json(foldersCreatorResponse)
    } catch(error){
        console.error(`An error happened while we tried to use the foldersCreator function: '${error}'`)
        res.status(500).send(error.message)
    }
})

module.exports = router;