import DockerVersionPage from '../pages/DockerVersionPage'
import StacksPage from '../pages/StacksPage'
import ServicesPage from '../pages/ServicesPage'
import NodesPage from '../pages/NodesPage'
import NetworksPage from '../pages/NetworksPage'
import WebTerminalPage from '../pages/WebTerminalPage'

const routes = [

    {name: "DockerVersionPage", path: '/docker/version', component: DockerVersionPage},

    {name: "StacksPage", path: '/docker/stacks', component: StacksPage},

    {name: "ServicesPage", path: '/docker/services/:stack?', component: ServicesPage},

    {name: "NodesPage", path: '/docker/nodes', component: NodesPage},

    {name: "NetworksPage", path: '/docker/networks', component: NetworksPage},

    {
        name: "WebTerminalPage",
        path: '/docker/terminal/:task/:service/:terminal',
        component: WebTerminalPage,
        meta: {layout: 'TerminalLayout'}
    },

]

export default routes
