import express from 'express'
import http from "http";
import { DOCKER_VIEW } from '../permissions/dockerPermissions';
import { AuthenticationError, ForbiddenError } from 'apollo-server-express';
import { fetchTask, findTaskLogs } from '../services/DockerTaskService';
import { getSettingsValueByKey } from '@dracul/settings-backend';

const validateStatusCode = (statusCode) => http.STATUS_CODES.hasOwnProperty(statusCode)

let router = express.Router();

router.get('/docker/logs/:stackName/:serviceName', async function (req, res) {
    try {
        if (!req.user) throw new AuthenticationError("Not Authorized")
        if (!req.rbac.isAllowed(req.user.id, DOCKER_VIEW)) throw new ForbiddenError("Not Authorized")

        const {stackName, serviceName} = req.params
        const {lines = 30, search = ''} = req.query

        const maxLogsLines = Number(await getSettingsValueByKey('maxLogsLines'))
        if(Number(lines) > Number(maxLogsLines) || lines === 'all') throw new Error('Lines limit is exceeded')


        const tasks = await fetchTask(`${stackName}_${serviceName}`)
        let firstTaskRunning = null

        tasks.forEach(task => {
            if (task.state === 'running' && !firstTaskRunning) firstTaskRunning = task
        })

        if (!firstTaskRunning) return res.send('task not found')

        const taskLogs = (await findTaskLogs(firstTaskRunning.id, {
            fetch: search,
            tail: lines
        })).map(({text}) => text)

        return res.json(taskLogs)
    } catch (error) {
        const statusCode = (error.statusCode && validateStatusCode(error.statusCode)) ? error.statusCode : 500
        res.status(statusCode).send(error.message)
    }
})

module.exports = router;