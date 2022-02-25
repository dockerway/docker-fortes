const Docker = require('dockerode');
var docker = new Docker({socketPath: '/var/run/docker.sock'});

export const serviceLogs = function (service, tail = 100) {
    return new Promise(async (resolve, reject) => {
        try {

            console.log("service", service)

            let filters = {
                stdout: true,
                stderr: true,
                since: 0,
                timestamps: true,
                tail: tail
            }

            let logs = await docker.getService(service).logs(filters)

            logs = logs.toString('utf8').replace(/\u0000|\u0002/g, "").replace(/�/g, "").split('\n')

            logs = logs.map(log => ({
                timestamp: log.substring(0, 30).trim(),
                text: log.substring(31)
            })).filter(log => log.text)

            //logs = logs.sort((a,b) => (a.timestamp < b.timestamp))
            resolve(logs)
        } catch (e) {
            reject(e)
        }

    })
}
