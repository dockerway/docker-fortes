import merge from 'deepmerge'
import GitlabRoutes from './GitlabRoutes'

const routes = merge.all([GitlabRoutes])


export default routes;

