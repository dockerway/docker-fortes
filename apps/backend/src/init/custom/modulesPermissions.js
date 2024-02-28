/* ADD YOUR MODULE PERMISSIONS HERE */

import {
    BASE_SHOW
} from '../../modules/base/permissions'

import {
    DOCKER_VIEW,
    DOCKER_REMOVE,
    DOCKER_RESTART,
    DOCKER_UPDATE,
    DOCKER_CREATE,
    DOCKER_LOGS,
    DOCKER_CONSOLE,
    DOCKER_NETWORK_CREATE,
    DOCKER_NETWORK_REMOVE,
    DOCKER_NETWORK_RESTART,
    DOCKER_NETWORK_UPDATE,
    DOCKER_NETWORK_VIEW,
    DOCKER_NODES_FETCH,
} from "../../modules/docker/permissions/dockerPermissions";

export default [
    BASE_SHOW,
    DOCKER_VIEW, DOCKER_REMOVE, DOCKER_RESTART, DOCKER_UPDATE, DOCKER_CREATE, DOCKER_LOGS, DOCKER_CONSOLE,
    DOCKER_NETWORK_CREATE,
    DOCKER_NETWORK_REMOVE,
    DOCKER_NETWORK_RESTART,
    DOCKER_NETWORK_UPDATE,
    DOCKER_NETWORK_VIEW,
    DOCKER_NODES_FETCH
]
