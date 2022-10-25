import merge from 'deepmerge'
import baseRoutes from '../modules/base/routes'
import dockerRoutes from '../modules/docker/routes'
import gitlabRoutes from '../modules/gitlab/routes'
import registryRoutes from '../modules/registry/routes'

import {routes as userRoutes} from '@dracul/user-frontend'
import {routes as customRoutes} from '@dracul/customize-frontend'
import {routes as notificationRoutes} from '@dracul/notification-frontend'
import {routes as settingsRoutes} from '@dracul/settings-frontend'
import {routes as auditRoutes} from '@dracul/audit-frontend'

const routes = merge.all([
    baseRoutes,
    dockerRoutes,
    gitlabRoutes,
    registryRoutes,
    userRoutes,
    notificationRoutes,
    customRoutes,
    settingsRoutes,
    auditRoutes
])


export default routes;
