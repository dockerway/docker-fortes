import merge from 'deepmerge'
import DockerManagementRoutes from './DockerCrudRoutes'
import ExtraRoutes from './DockerRoutes'

const routes = merge.all([DockerManagementRoutes,ExtraRoutes])


export default routes;

