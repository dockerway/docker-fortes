import express from 'express'
import createDirIfDoesntExist from '../helpers/createDirIfDoesntExist'
const fs = require('fs');

var router = express.Router();
import { DOCKER_UPDATE } from '../permissions/dockerPermissions';


router.post('/docker/files', async function (req, res) {
    try {
        const user = req.user;
        if(!user)  throw new AuthenticationError("Usted no esta autenticado o su token es incorrecto");
        if(!req.rbac.isAllowed(user.id, DOCKER_UPDATE)) throw new ForbiddenError("Not Authorized");

        if(!Array.isArray(req.body)) throw new Error("Request body must be an Array!")

        for(let i = 0; i < req.body.length; i++){
            if(!req.body[i].fileName || !req.body[i].fileContent || !req.body[i].hostPath) throw new Error("One of the properties of the file is not defined.")

            createDirIfDoesntExist(req.body[i].hostPath) //create the directory            

            let pathFile = req.body[i].containerPath + req.body[i].fileName
            fs.writeFile(pathFile,req.body[i].fileContent,{flag:'w'}, (err) => {
                if(err) throw err;
                console.log("The file has been saved!");
            })
        }

        res.status(200)
        res.send("File successfully created!")
    } catch(e){
        console.error("Error DockerFilesRoutes: ",e)
        res.status(500)
        res.send(e.message)
    }
})

module.exports = router;