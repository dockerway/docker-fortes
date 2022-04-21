import {
    DOCKER_RESTART,
    DOCKER_VIEW,
    DOCKER_UPDATE,
    DOCKER_REMOVE
} from "../../modules/docker/permissions/dockerPermissions";
import {AUDIT_MENU, AUDIT_SHOW} from "../../modules/docker/permissions/Audit";

module.exports = {
    name: "supervisor",
    permissions: [
        "SECURITY_GROUP_SHOW",
        "NOTIFICATION_SHOW",
        "NOTIFICATION_UPDATE",
        DOCKER_VIEW,
        DOCKER_RESTART, DOCKER_UPDATE, DOCKER_REMOVE,
        AUDIT_MENU, AUDIT_SHOW,
    ],
    readonly: true
}
