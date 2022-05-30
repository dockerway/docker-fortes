import express from 'express'
const fs = require('fs');
const path = require('path');

var router = express.Router();

router.post('/docker/files', async function (req, res) {
    try {
        if(!Array.isArray(req.body)) throw new Error("Request body must be an Array!")

        for(let i = 0; i < req.body.length; i++){
            if(!req.body[i].fileName || !req.body[i].fileContent || !req.body[i].containerPath) throw new Error("One of the properties of the file is not defined.")

            await createDirIfDoesntExist(req.body[i].containerPath) //create the directory            

            let pathFile = req.body[i].containerPath + req.body[i].fileName
            fs.writeFile(pathFile,req.body[i].fileContent,{flag:'w'}, (err) => {
                if(err) throw err;
                console.log("The file has been saved!");
            })
        }

        res.status(200)
        res.send("File successfully created!")
    } catch(e){
        res.status(500)
        res.send(e.message)
    }
})

const createDirIfDoesntExist = function(dst){
    let dir = path.dirname(dst)
    fs.promises.mkdir(dir, { recursive: true });
}

module.exports = router;