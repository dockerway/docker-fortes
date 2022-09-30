import {DOCKER_CONSOLE, DOCKER_LOGS, DOCKER_REMOVE, DOCKER_VIEW} from "../../modules/docker/permissions/dockerPermissions";

module.exports = {
    name: "qa",
    permissions: [
        "SECURITY_GROUP_SHOW",
        "NOTIFICATION_SHOW",
        "NOTIFICATION_UPDATE",
        DOCKER_VIEW,
        DOCKER_REMOVE,
        DOCKER_LOGS,
        DOCKER_CONSOLE,
    ],
    readonly: true
}
