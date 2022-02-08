/* ADD YOUR MODULE PERMISSIONS HERE */

import {
    BASE_SHOW
} from '../../modules/base/permissions'

import {
    DOCKER_VIEW,
    DOCKER_REMOVE,
    DOCKER_RESTART,
    DOCKER_UPDATE
} from "../../modules/docker/permissions/dockerPermissions";
import {AUDIT_CREATE, AUDIT_DELETE, AUDIT_MENU, AUDIT_SHOW, AUDIT_UPDATE} from "../../modules/docker/permissions/Audit";


export default [
    BASE_SHOW,
    DOCKER_VIEW, DOCKER_REMOVE, DOCKER_RESTART, DOCKER_UPDATE,

    AUDIT_CREATE, AUDIT_DELETE, AUDIT_MENU, AUDIT_SHOW, AUDIT_UPDATE
]
