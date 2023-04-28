import { checkIfMountedDirectoriesExists, notMountedMessage } from '../helpers/checkMountedVolumes.js';
import {createDirIfDoesntExist} from '../helpers/createDirIfDoesntExist';
import { DOCKER_UPDATE } from '../permissions/dockerPermissions';
import express from 'express';

const router = express.Router()
const fs = require('fs')

router.post('/docker/files', async function (req, res) {
    try {
        if (!req.user) throw new AuthenticationError("Usted no esta autenticado o su token es incorrecto")
        if (!req.rbac.isAllowed(req.user.id, DOCKER_UPDATE)) throw new ForbiddenError("Not Authorized")
        if (!Array.isArray(req.body)) throw new Error("Request body must be an Array!")
        if (!checkIfMountedDirectoriesExists()) res.send(notMountedMessage)

        for(let i = 0; i < req.body.length; i++){
            if(!req.body[i].fileName || !req.body[i].fileContent || !req.body[i].hostPath) throw new Error("One of the properties of the file is not defined.")
            createDirIfDoesntExist(req.body[i].hostPath) 

            const pathFile = req.body[i].hostPath + "/" + req.body[i].fileName
            fs.writeFile(pathFile,req.body[i].fileContent,{flag:'w'}, (err) => {
                if(err) throw err
                console.log("The file has been saved!")
            })
        }

        res.status(200).send("File successfully created!")
    } catch(error){
        console.error("Error DockerFilesRoutes: ", error)
        res.status(500).send(error.message)
    }
})

module.exports = router;