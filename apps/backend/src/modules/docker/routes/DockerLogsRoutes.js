import express from 'express'
import http from "http";
import { DOCKER_VIEW } from '../permissions/dockerPermissions';
import { AuthenticationError, ForbiddenError, UserInputError } from 'apollo-server-express';
import { fetchTask, findTaskLogs } from '../services/DockerTaskService';
import { getSettingsValueByKey } from '@dracul/settings-backend';


var router = express.Router();

function validateStatusCode(statusCode){
    return http.STATUS_CODES.hasOwnProperty(statusCode)
}

router.get('/docker/logs/:stackName/:serviceName', async function (req, res) {
    try {
        const {stackName, serviceName} = req.params
        const {lines = 1    , search = ''} = req.query

        const maxLogsLines = await getSettingsValueByKey('maxLogsLines')

        if(lines > await getSettingsValueByKey('maxLogsLines' || lines === 'all')){
            throw new Error('Lines limit is exceeded')
        }

        const user = req.user
        if(!user) throw new AuthenticationError("Not Authorized")
        if(!req.rbac.isAllowed(user.id, DOCKER_VIEW)) throw new ForbiddenError("Not Authorized")

        const tasks = await fetchTask(`${stackName}_${serviceName}`)
        let firstTaskRunning = null

        tasks.forEach(task => {
            if(firstTaskRunning != null) return
            if(task.state === 'running') firstTaskRunning = task
        })

        if(firstTaskRunning === null) return res.send('task not found')

        let taskLogs = await findTaskLogs(firstTaskRunning.id, {
            fetch: search,
            tail: lines
        })

        taskLogs = taskLogs.map(({text}) => {
            return text
        })

        return res.json(taskLogs)
    } catch (e) {
        let statusCode = (e.statusCode && validateStatusCode(e.statusCode)) ? e.statusCode : 500
        res.status(statusCode)
        res.send(e.message)
    }
})

module.exports = router;