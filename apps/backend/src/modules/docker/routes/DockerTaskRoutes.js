import express from 'express';
import http from "http";
import {taskStats} from "../services/DockerStatsService";
import {fetchTask} from '../services/DockerTaskService';

const router = express.Router()

function validateStatusCode(statusCode){
    return http.STATUS_CODES.hasOwnProperty(statusCode)
}

router.get('/docker/task/:taskid/stats', async function (req, res) {
    try {
        res.json(await taskStats(req.params.taskid))
    } catch (error) {
        const statusCode = (error.statusCode && validateStatusCode(error.statusCode)) ? error.statusCode : 500

        res.status(statusCode)
        res.send(error.message)
    }
})

router.get('/docker/tasks/:serviceIdentifier', async function (req, res) {
    try {
        res.json(await fetchTask(req.params.serviceIdentifier))
    } catch (error) {
        const statusCode = (error.statusCode && validateStatusCode(error.statusCode)) ? error.statusCode : 500
        res.status(statusCode).send(error.message)
    }
})



module.exports = router;
