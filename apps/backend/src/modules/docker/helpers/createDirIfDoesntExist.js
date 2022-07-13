const fs = require('fs');

const createDirIfDoesntExist = function(dst){
    console.log("DESTINO: ",dst)
    if (!fs.existsSync(dst)){
        fs.mkdirSync(dst,{recursive:true});
    }
}

module.exports.createDirIfDoesntExist = createDirIfDoesntExist
module.exports =  createDirIfDoesntExist