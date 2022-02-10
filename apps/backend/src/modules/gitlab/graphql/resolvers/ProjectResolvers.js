import {AuthenticationError} from "apollo-server-errors";
import {projectTags} from "../../services/ProjectService";


export default {
    Query: {
        projectTags: (_,{id},{user}) => {
           // if(!user)  throw new AuthenticationError("Usted no esta autenticado")

            return projectTags(id)
        },

    }
}
