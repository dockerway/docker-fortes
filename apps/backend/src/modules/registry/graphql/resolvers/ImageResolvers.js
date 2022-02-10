import {AuthenticationError} from "apollo-server-errors";
import {fetchImage, imageTags} from "../../services/ImageService";


export default {
    Query: {
        fetchImage: (_,{rows},{user}) => {
            if(!user)  throw new AuthenticationError("Usted no esta autenticado")

            return fetchImage(rows)
        },
        imageTags: (_,{name},{user}) => {
            if(!user)  throw new AuthenticationError("Usted no esta autenticado")

            return imageTags(name)
        },

    }
}
