import express from 'express';
import http from "http";
import {taskStats} from "../services/DockerStatsService";
import {runTerminalOnRemoteTaskContainer} from '../services/DockerTaskService';


var router = express.Router();

function validateStatusCode(statusCode){
    return http.STATUS_CODES.hasOwnProperty(statusCode)
}

router.get('/docker/task/:taskid/stats', async function (req, res) {
    try {
        let r = await taskStats(req.params.taskid)
        res.json(r)

    } catch (e) {
        let statusCode = (e.statusCode && validateStatusCode(e.statusCode)) ? e.statusCode : 500
        res.status(statusCode)
        res.send(e.message)
    }
});

router.get('/docker/task/:nodeId/:containerId/runTerminal/:terminal', async function (req, res) {
    try {
        const response = await runTerminalOnRemoteTaskContainer(req.params.nodeId, req.params.containerId);
        console.log(`RESPONSE from LINE 27: '${response}'`);
        res.send(response);

    } catch (error) {
        let statusCode = (error.statusCode && validateStatusCode(error.statusCode)) ? error.statusCode : 500;
        res.status(statusCode);
        res.send(error.message);
    }
});




module.exports = router;
