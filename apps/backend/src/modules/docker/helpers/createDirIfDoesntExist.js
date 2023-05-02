const fs = require('fs');

const createDirIfDoesntExist = function(directoryPath){
    try {
        if (!fs.existsSync(directoryPath)) fs.mkdirSync(directoryPath, {recursive:true})
    } catch (error) {
        console.error(`An error happened at createDirIfDoesntExist: '${error}'`)
    }
}

module.exports.createDirIfDoesntExist = createDirIfDoesntExist