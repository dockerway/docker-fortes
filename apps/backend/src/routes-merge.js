import express from 'express'
import DockerRoutes from './modules/docker/routes/DockerRoutes'
import GitlabRoutes from './modules/gitlab/routes/GitlabRoutes'
import RegistryRoutes from './modules/registry/routes/RegistryRoutes'
let router = express.Router();

router.use('/', DockerRoutes);
router.use('/', GitlabRoutes);
router.use('/', RegistryRoutes);


export default router
