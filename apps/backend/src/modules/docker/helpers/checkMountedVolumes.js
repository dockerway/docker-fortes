const { getSettingsValueByKey } = require('@dracul/settings-backend');
const fs = require('fs');

const checkIfMountedDirectoriesExists = async function() {
  try {
    const directories = await getSettingsValueByKey('volumes')
    
    for (let i = 0; i < directories.length; i++) {
      const directory = directories[i]
      
      if (!fs.existsSync(directory)) {
        console.log(`Directory does not exist: '${directory}'`)
        return false
      }
    }
    
    console.log('All directories exist.')
    return true
  } catch (error) {
    console.error(`An error occurred at checkIfMountedDirectoriesExists: '${error}'`)
    throw error
  }
}

const notMountedMessage = 'The needed directories are not mounted; please contact your infrastructure team!'

module.exports.checkIfMountedDirectoriesExists = checkIfMountedDirectoriesExists;
module.exports.notMountedMessage = notMountedMessage;
