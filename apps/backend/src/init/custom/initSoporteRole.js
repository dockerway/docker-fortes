import {DOCKER_RESTART, DOCKER_VIEW} from "../../modules/docker/permissions/dockerPermissions";

module.exports = {
    name: "Soporte",
    permissions: [
        "SECURITY_GROUP_SHOW",
        "NOTIFICATION_SHOW",
        "NOTIFICATION_UPDATE",
    ],
    readonly: true
}
