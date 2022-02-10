import {AuthenticationError} from "apollo-server-errors";
import {imageTags} from "../../services/ImageService";


export default {
    Query: {
        imageTags: (_,{name},{user}) => {
           // if(!user)  throw new AuthenticationError("Usted no esta autenticado")

            return imageTags(name)
        },

    }
}
