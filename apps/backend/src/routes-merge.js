import express from 'express'
import swaggerUi from 'swagger-ui-express'
import DockerServiceRoutes from './modules/docker/routes/DockerServiceRoutes'
import DockerFolderCreator from './modules/docker/routes/DockerFolderCreator'
import DockerFilesRoutes from './modules/docker/routes/DockerFilesRoutes'
import DockerTaskRoutes from './modules/docker/routes/DockerTaskRoutes'
import GitlabRoutes from './modules/gitlab/routes/GitlabRoutes'
import RegistryRoutes from './modules/registry/routes/RegistryRoutes'
let router = express.Router();

const swaggerDocument = require('./swagger.json')

router.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument) )
router.use('/', DockerServiceRoutes);
router.use('/', DockerFolderCreator);
router.use('/', DockerFilesRoutes);
router.use('/', DockerTaskRoutes);
router.use('/', GitlabRoutes);
router.use('/', RegistryRoutes);


export default router
