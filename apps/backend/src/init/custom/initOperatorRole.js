import {DOCKER_RESTART, DOCKER_VIEW} from "../../modules/docker/permissions/dockerPermissions";

module.exports = {
    name: "operator",
    permissions: [
        "SECURITY_GROUP_SHOW",
        "NOTIFICATION_SHOW",
        "NOTIFICATION_UPDATE",
        DOCKER_VIEW,
        DOCKER_RESTART
    ]
}
