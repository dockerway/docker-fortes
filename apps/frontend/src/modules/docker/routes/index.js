import merge from 'deepmerge'
import ExtraRoutes from './DockerRoutes'

const routes = merge.all([ExtraRoutes])


export default routes;

