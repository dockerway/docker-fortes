import express from 'express'
import {fetchImage, imageTags} from "../services/ImageService";


var router = express.Router();


router.get('/registry/image', async function (req, res) {
    let r = await fetchImage(req.query.rows)
    res.json(r)
})

router.get('/registry/image/tags', async function (req, res) {
   let r = await imageTags(req.query.name)
    res.json(r)
})


module.exports = router;
