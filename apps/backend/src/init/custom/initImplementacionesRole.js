import {DOCKER_CONSOLE, DOCKER_CREATE, DOCKER_LOGS, DOCKER_REMOVE, DOCKER_RESTART, DOCKER_UPDATE, DOCKER_VIEW} from "../../modules/docker/permissions/dockerPermissions";

module.exports = {
    name: "Implementaciones",
    permissions: [
        "SECURITY_GROUP_SHOW",
        "NOTIFICATION_SHOW",
        "NOTIFICATION_UPDATE",
        DOCKER_VIEW,
        DOCKER_REMOVE,
        DOCKER_RESTART,
        DOCKER_LOGS,
        DOCKER_CONSOLE,
        DOCKER_CREATE,
        DOCKER_UPDATE
    ],
    readonly: true
}
