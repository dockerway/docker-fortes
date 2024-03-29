



import {AuthenticationError, ForbiddenError} from "apollo-server-express";
import {DOCKER_CREATE, DOCKER_REMOVE, DOCKER_RESTART, DOCKER_UPDATE, DOCKER_VIEW} from "../../permissions/dockerPermissions";

import {fetchNode, fetchNodeAndTasks, findNode} from "../../services/DockerNodeService";
import {fetchContainer} from "../../services/DockerContainerService";
import {fetchStack} from "../../services/DockerStackService";
import {findTaskLogs, fetchTaskInspect} from "../../services/DockerTaskService"

import {
    dockerServiceCreate,
    dockerServiceUpdate,
    fetchService,
    findServiceByName,
    findServiceTag,
    findServiceById

} from "../../services/DockerService";
import {
    dnsTaskRunningByServiceAndNode,
    fetchTask,
    findTaskRunningByServiceAndNode
} from "../../services/DockerTaskService";
import {
    dockerNodesServicesAndTasksQuantity,
    dockerRemove,
    dockerRemoveMany,
    dockerRestart,
    dockerRestartMany,
    dockerVersion
} from "../../services/DockerManageService";
import {containerStats, serviceStats, serviceStatsByName, taskStats} from "../../services/DockerStatsService";
import {getNetworks} from "../../services/DockerNetworksService";

export default {
    Query: {
        dockerNodesServicesAndTasksQuantity: (_,{},{user,rbac}) => {
            if(!user)  throw new AuthenticationError("Usted no esta autenticado")
            if(!rbac.isAllowed(user.id, DOCKER_VIEW)) throw new ForbiddenError("Not Authorized")
            return dockerNodesServicesAndTasksQuantity()  
        },
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
            return findServiceByName(name)
        },
        findServiceById: (_,{id},{user,rbac}) => {
            if(!user)  throw new AuthenticationError("Usted no esta autenticado")
            if(!rbac.isAllowed(user.id, DOCKER_VIEW)) throw new ForbiddenError("Not Authorized")
            return findServiceById(id)
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
            if (!user) throw new AuthenticationError("Usted no esta autenticado")
            if (!rbac.isAllowed(user.id, DOCKER_VIEW)) throw new ForbiddenError("Not Authorized")

            return fetchTask(service)
        },
        fetchTaskInspect: (_,{taskId},{user,rbac}) => {
            if (!user) throw new AuthenticationError("Usted no esta autenticado")
            if (!rbac.isAllowed(user.id, DOCKER_VIEW)) throw new ForbiddenError("Not Authorized")

            return fetchTaskInspect(taskId)
        },
        findTaskRunningByServiceAndNode: (_,{serviceName, nodeId},{user,rbac}) => {
            if (!user) throw new AuthenticationError("Usted no esta autenticado")
            if (!rbac.isAllowed(user.id, DOCKER_VIEW)) throw new ForbiddenError("Not Authorized")

            return findTaskRunningByServiceAndNode(serviceName, nodeId)
        },
        dnsTaskRunningByServiceAndNode: (_,{serviceName, nodeId},{user,rbac}) => {
            if (!user) throw new AuthenticationError("Usted no esta autenticado")
            if (!rbac.isAllowed(user.id, DOCKER_VIEW)) throw new ForbiddenError("Not Authorized")

            return dnsTaskRunningByServiceAndNode(serviceName, nodeId)
        },
        fetchNode: (_,{role},{user,rbac}) => {
            if(!user)  throw new AuthenticationError("Usted no esta autenticado")
            if(!rbac.isAllowed(user.id, DOCKER_VIEW)) throw new ForbiddenError("Not Authorized")
            return fetchNode(role)
        },
        fetchNodeAndTasks: (_,__,{user,rbac}) => {
            if(!user)  throw new AuthenticationError("Usted no esta autenticado")
            if(!rbac.isAllowed(user.id, DOCKER_VIEW)) throw new ForbiddenError("Not Authorized")
            return fetchNodeAndTasks()
        },
        findNode: (_,{id},{user,rbac}) => {
            if(!user)  throw new AuthenticationError("Usted no esta autenticado")
            if(!rbac.isAllowed(user.id, DOCKER_VIEW)) throw new ForbiddenError("Not Authorized")
            return findNode(id)
        },
        serviceTaskLogs: (_,{task,filters},{user,rbac}) => {
             if(!user)  throw new AuthenticationError("Usted no esta autenticado")
            if(!rbac.isAllowed(user.id, DOCKER_VIEW)) throw new ForbiddenError("Not Authorized")
            return findTaskLogs(task,filters)
        },

        serviceStats: (_,{serviceId},{user,rbac}) => {
            if(!user)  throw new AuthenticationError("Usted no esta autenticado")
            if(!rbac.isAllowed(user.id, DOCKER_VIEW)) throw new ForbiddenError("Not Authorized")
            return serviceStats(serviceId)
        },

        serviceStatsByName: (_,{serviceName},{user,rbac}) => {
            if(!user)  throw new AuthenticationError("Usted no esta autenticado")
            if(!rbac.isAllowed(user.id, DOCKER_VIEW)) throw new ForbiddenError("Not Authorized")
            return serviceStatsByName(serviceName)
        },

        taskStats: (_,{taskId},{user,rbac}) => {
            if(!user)  throw new AuthenticationError("Usted no esta autenticado")
            if(!rbac.isAllowed(user.id, DOCKER_VIEW)) throw new ForbiddenError("Not Authorized")
            return taskStats(taskId)
        },

        containerStats: (_,{containerId},{user,rbac}) => {
            if (!user) throw new AuthenticationError("Usted no esta autenticado")
            if (!rbac.isAllowed(user.id, DOCKER_VIEW)) throw new ForbiddenError("Not Authorized")
            
            return containerStats(containerId)
        },

        fetchNetworks: (_,{},{user,rbac}) => {
            if (!user) throw new AuthenticationError("Usted no esta autenticado")
            if (!rbac.isAllowed(user.id, DOCKER_VIEW)) throw new ForbiddenError("Not Authorized")

            return getNetworks()
        },
    },
    Mutation:{

        dockerServiceCreate: (_,{input},{user,rbac}) => {
            if(!user)  throw new AuthenticationError("Usted no esta autenticado")
            if(!rbac.isAllowed(user.id, DOCKER_CREATE)) throw new ForbiddenError("Not Authorized")
            return dockerServiceCreate(user, input)
        },

        dockerServiceUpdate: (_,{input},{user,rbac}) => {
            if(!user)  throw new AuthenticationError("Usted no esta autenticado")
            if(!rbac.isAllowed(user.id, DOCKER_UPDATE)) throw new ForbiddenError("Not Authorized")
            return dockerServiceUpdate(user, input)
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
