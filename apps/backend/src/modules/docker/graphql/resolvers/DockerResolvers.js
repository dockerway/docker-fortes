import {AuthenticationError} from "apollo-server-errors";
import {
    dockerVersion,
    fetchContainer,
    fetchNode,
    fetchService,
    fetchStack, fetchTask, findNode,
    serviceLogs
} from "../../service/DockerService";


export default {
    Query: {
        dockerVersion: (_,{},{user}) => {
            if(!user)  throw new AuthenticationError("Usted no esta autenticado")

            return dockerVersion()
        },
        fetchStack: (_,{},{user}) => {
             if(!user)  throw new AuthenticationError("Usted no esta autenticado")
            return fetchStack()
        },
        fetchService: (_,{stack},{user}) => {
             if(!user)  throw new AuthenticationError("Usted no esta autenticado")
            return fetchService(stack)
        },
        fetchContainer: (_,{service},{user}) => {
            if(!user)  throw new AuthenticationError("Usted no esta autenticado")
            return fetchContainer(service)
        },
        fetchTask: (_,{service},{user}) => {
            if(!user)  throw new AuthenticationError("Usted no esta autenticado")
            return fetchTask(service)
        },
        fetchNode: (_,{role},{user}) => {
            if(!user)  throw new AuthenticationError("Usted no esta autenticado")
            return fetchNode(role)
        },
        findNode: (_,{id},{user}) => {
            if(!user)  throw new AuthenticationError("Usted no esta autenticado")
            return findNode(id)
        },
        serviceLogs: (_,{service},{user}) => {
             if(!user)  throw new AuthenticationError("Usted no esta autenticado")

            return serviceLogs(service)
        },

    }
}
