import express from 'express'
import DockerRoutes from './modules/docker/routes/DockerRoutes'
let router = express.Router();

router.use('/', DockerRoutes);


export default router
