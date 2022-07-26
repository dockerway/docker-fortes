import DockerVersionPage from '../pages/DockerVersionPage'
import StacksPage from '../pages/StacksPage'
import ServicesPage from '../pages/ServicesPage'
import NodesPage from '../pages/NodesPage'
import WebTerminalPage from '../pages/WebTerminalPage'

const routes = [

    {name: "DockerVersionPage", path: '/docker/version', component: DockerVersionPage},

    {name: "StacksPage", path: '/docker/stacks', component: StacksPage},

    {name: "ServicesPage", path: '/docker/services/:stack?', component: ServicesPage},

    {name: "NodesPage", path: '/docker/nodes', component: NodesPage},

    {
        name: "WebTerminalPage",
        path: '/docker/terminal/:nodeid/:containerid',
        component: WebTerminalPage,
        meta: {layout: 'TerminalLayout'}
    },

]

export default routes
