import DockerVersionPage from '../pages/DockerVersionPage'
import StacksPage from '../pages/StacksPage'
import ServicesPage from '../pages/ServicesPage'
import NodesPage from '../pages/NodesPage'
import NetworksPage from '../pages/NetworksPage'
import WebTerminalPage from '../pages/WebTerminalPage'
import ClusterInformationPage from '../pages/ClusterInformationPage'
import ContainerMonitorizationPage from '../pages/containerMonitorizationPage/ContainerMonitorizationPage.vue'

const routes = [

    {
        name: "DockerVersionPage",
        path: '/docker/version',
        component: DockerVersionPage,
        meta: {
            requiresAuth: true,
            permission: 'DOCKER_VIEW'
        }
    },

    {
        name: "StacksPage",
        path: '/docker/stacks',
        component: StacksPage,
        meta: {
            requiresAuth: true,
            permission: 'DOCKER_VIEW'
        }
    },

    { 
        name: "ServicesPage",
        path: '/docker/services/:stack?',
        component: ServicesPage,
        meta: {
            requiresAuth: true,
            permission: 'DOCKER_VIEW'
        }
    },

    { 
        name: "NodesPage",
        path: '/docker/nodes',
        component: NodesPage,
        meta: {
            requiresAuth: true,
            permission: 'DOCKER_VIEW'
        }
    },

    {
        name: "NetworksPage",
        path: '/docker/networks',
        component: NetworksPage,
        meta: {
            requiresAuth: true,
            permission: 'DOCKER_VIEW'
        }
    },

    {
        name: "WebTerminalPage",
        path: '/docker/terminal/:taskId/:terminal',
        component: WebTerminalPage,
        meta: { 
            requiresAuth: true,
            permission: 'DOCKER_VIEW' 
        }
    },

    {
        name: 'ClusterInformationPage',
        path: '/docker/cluster-information',
        component: ClusterInformationPage,
        meta: {
            requiresAuth: true,
            permission: 'DOCKER_VIEW'
        }
    },
    {
        name: 'ContainerMonitorizationPage',
        path: '/docker/container-monitorization',
        component: ContainerMonitorizationPage,
        meta: {
            requiresAuth: true,
            permission: 'DOCKER_VIEW'
        }
    }

]

export default routes
