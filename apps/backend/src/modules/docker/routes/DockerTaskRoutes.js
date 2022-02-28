import express from 'express'
import {
    dockerServiceCreate,
    dockerServiceUpdate,
    fetchService,
    findServiceByName,
    findServiceTag
} from "../services/DockerService";
import http from "http";
import {taskStats} from "../services/DockerStatsService";


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
})




module.exports = router;
