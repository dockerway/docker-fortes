



import {AuthenticationError, ForbiddenError} from "apollo-server-express";
import {DOCKER_CREATE, DOCKER_REMOVE, DOCKER_RESTART, DOCKER_VIEW} from "../../permissions/dockerPermissions";

import {fetchNode, findNode} from "../../services/DockerNodeService";
import {serviceLogs} from "../../services/DockerLogService";
import {fetchContainer} from "../../services/DockerContainerService";
import {fetchStack} from "../../services/DockerStackService";

import {
    dockerServiceCreate,
    fetchService,
    findService,
    findServiceTag,

} from "../../services/DockerService";
import {fetchTask} from "../../services/DockerTaskService";
import {
    dockerRemove,
    dockerRemoveMany,
    dockerRestart,
    dockerRestartMany,
    dockerVersion
} from "../../services/DockerManageService";

export default {
    Query: {
        dockerVersion: (_,{},{user,rbac}) => {
            if(!user)  throw new AuthenticationError("Usted no esta autenticado")
            if(!rbac.isAllowed(user.id, DOCKER_VIEW)) throw new ForbiddenError("Not Authorized")
            return dockerVersion()
        },
        fetchStack: (_,{},{user,rbac}) => {
             if(!user)  throw new AuthenticationError("Usted no esta autenticado")
            if(!rbac.isAllowed(user.id, DOCKER_VIEW)) throw new ForbiddenError("Not Authorized")
            return fetchStack()
        },
        findServiceTag: (_,{name},{user,rbac}) => {
            if(!user)  throw new AuthenticationError("Usted no esta autenticado")
            if(!rbac.isAllowed(user.id, DOCKER_VIEW)) throw new ForbiddenError("Not Authorized")
            return findServiceTag(name)
        },
        findService: (_,{name},{user,rbac}) => {
            if(!user)  throw new AuthenticationError("Usted no esta autenticado")
            if(!rbac.isAllowed(user.id, DOCKER_VIEW)) throw new ForbiddenError("Not Authorized")
            return findService(name)
        },
        fetchService: (_,{stack},{user,rbac}) => {
             if(!user)  throw new AuthenticationError("Usted no esta autenticado")
            if(!rbac.isAllowed(user.id, DOCKER_VIEW)) throw new ForbiddenError("Not Authorized")
            return fetchService(stack)
        },
        fetchContainer: (_,{service},{user,rbac}) => {
            if(!user)  throw new AuthenticationError("Usted no esta autenticado")
            if(!rbac.isAllowed(user.id, DOCKER_VIEW)) throw new ForbiddenError("Not Authorized")
            return fetchContainer(service)
        },
        fetchTask: (_,{service},{user,rbac}) => {
            if(!user)  throw new AuthenticationError("Usted no esta autenticado")
            if(!rbac.isAllowed(user.id, DOCKER_VIEW)) throw new ForbiddenError("Not Authorized")
            return fetchTask(service)
        },
        fetchNode: (_,{role},{user,rbac}) => {
            if(!user)  throw new AuthenticationError("Usted no esta autenticado")
            if(!rbac.isAllowed(user.id, DOCKER_VIEW)) throw new ForbiddenError("Not Authorized")
            return fetchNode(role)
        },
        findNode: (_,{id},{user,rbac}) => {
            if(!user)  throw new AuthenticationError("Usted no esta autenticado")
            if(!rbac.isAllowed(user.id, DOCKER_VIEW)) throw new ForbiddenError("Not Authorized")
            return findNode(id)
        },
        serviceLogs: (_,{service},{user,rbac}) => {
             if(!user)  throw new AuthenticationError("Usted no esta autenticado")
            if(!rbac.isAllowed(user.id, DOCKER_VIEW)) throw new ForbiddenError("Not Authorized")
            return serviceLogs(service)
        },

    },
    Mutation:{

        dockerServiceCreate: (_,{input},{user,rbac}) => {
            if(!user)  throw new AuthenticationError("Usted no esta autenticado")
            if(!rbac.isAllowed(user.id, DOCKER_CREATE)) throw new ForbiddenError("Not Authorized")
            return dockerServiceCreate(user, input)
        },

        dockerRestart: (_,{serviceId},{user,rbac}) => {
            if(!user)  throw new AuthenticationError("Usted no esta autenticado")
            if(!rbac.isAllowed(user.id, DOCKER_RESTART)) throw new ForbiddenError("Not Authorized")
            return dockerRestart(user, serviceId)
        },
        dockerRestartMany: (_,{serviceIds},{user,rbac}) => {
            if(!user)  throw new AuthenticationError("Usted no esta autenticado")
            if(!rbac.isAllowed(user.id, DOCKER_RESTART)) throw new ForbiddenError("Not Authorized")
            return dockerRestartMany(user, serviceIds)
        },

        dockerRemove: (_,{serviceId},{user,rbac}) => {
            if(!user)  throw new AuthenticationError("Usted no esta autenticado")
            if(!rbac.isAllowed(user.id, DOCKER_REMOVE)) throw new ForbiddenError("Not Authorized")
            return dockerRemove(user, serviceId)
        },
        dockerRemoveMany: (_,{serviceIds},{user,rbac}) => {
            if(!user)  throw new AuthenticationError("Usted no esta autenticado")
            if(!rbac.isAllowed(user.id, DOCKER_REMOVE)) throw new ForbiddenError("Not Authorized")
            return dockerRemoveMany(user, serviceIds)
        },
    }
}
