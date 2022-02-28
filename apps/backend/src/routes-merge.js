import express from 'express'
import swaggerUi from 'swagger-ui-express'
import DockerServiceRoutes from './modules/docker/routes/DockerServiceRoutes'
import DockerTaskRoutes from './modules/docker/routes/DockerTaskRoutes'
import GitlabRoutes from './modules/gitlab/routes/GitlabRoutes'
import RegistryRoutes from './modules/registry/routes/RegistryRoutes'
let router = express.Router();

const swaggerDocument = require('./swagger.json')

router.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument) )
router.use('/', DockerServiceRoutes);
router.use('/', DockerTaskRoutes);
router.use('/', GitlabRoutes);
router.use('/', RegistryRoutes);


export default router
