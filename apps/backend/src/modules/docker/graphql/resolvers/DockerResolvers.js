import {
    dockerRemove, dockerRemoveMany,
    dockerRestart, dockerRestartMany,
    dockerVersion,
    fetchContainer,
    fetchNode,
    fetchService,
    fetchStack, fetchTask, findNode, findService,
    serviceLogs
} from "../../services/DockerService";
import {AuthenticationError, ForbiddenError} from "apollo-server-express";
import {DOCKER_REMOVE, DOCKER_RESTART, DOCKER_VIEW} from "../../permissions/dockerPermissions";


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
