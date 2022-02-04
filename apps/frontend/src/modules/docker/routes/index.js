import DockerVersionPage from '../pages/DockerVersionPage'
import StacksPage from '../pages/StacksPage'
import ServicesPage from '../pages/ServicesPage'

const routes = [
    {name: "DockerVersionPage", path: '/docker/version', component: DockerVersionPage},
    {name: "StacksPage", path: '/docker/stacks', component: StacksPage},
    {name: "ServicesPage", path: '/docker/services/:stack?', component: ServicesPage},

]

export default routes
