import {AuthenticationError} from "apollo-server-errors";
import {fetchProject, projectTags} from "../../services/ProjectService";


export default {
    Query: {
        projectTags: (_,{id},{user}) => {
            if(!user)  throw new AuthenticationError("Usted no esta autenticado")
            return projectTags(id)
        },
        fetchProject: (_,{page, per_page},{user}) => {
            if(!user)  throw new AuthenticationError("Usted no esta autenticado")
            return fetchProject(page, per_page)
        },
    }
}
