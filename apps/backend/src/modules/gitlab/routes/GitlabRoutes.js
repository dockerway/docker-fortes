import express from 'express'
import {fetchProject, projectTags} from "../services/ProjectService";


var router = express.Router();


router.get('/gitlab/project', async function (req, res) {
    let r = await fetchProject(req.query.page, req.query.per_page)
    res.json(r)
})

router.get('/gitlab/project/:id/tags', async function (req, res) {
   let r = await projectTags(req.params.id)
    res.json(r)
})


module.exports = router;
