import {AuthenticationError} from "apollo-server-errors";
import {dockerVersion, fetchService, fetchStack} from "../../service/DockerService";


export default {
    Query: {
        dockerVersion: (_,{},{user}) => {
           // if(!user)  throw new AuthenticationError("Usted no esta autenticado")

            return dockerVersion()
        },
        fetchStack: (_,{},{user}) => {
            // if(!user)  throw new AuthenticationError("Usted no esta autenticado")
            return fetchStack()
        },
        fetchService: (_,{stack},{user}) => {
            // if(!user)  throw new AuthenticationError("Usted no esta autenticado")
            return fetchService(stack)
        },

    }
}
