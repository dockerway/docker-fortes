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
    DOCKER_CONSOLE
} from "../../modules/docker/permissions/dockerPermissions";


export default [
    BASE_SHOW,
    DOCKER_VIEW, DOCKER_REMOVE, DOCKER_RESTART, DOCKER_UPDATE, DOCKER_CREATE,DOCKER_LOGS, DOCKER_CONSOLE
]
