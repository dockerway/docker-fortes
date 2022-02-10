import axios from 'axios'

export const projectTags = function (id) {
    return new Promise(async (resolve, reject) => {
        try {
            console.log(process.env.GITLAB_URL, process.env.GITLAB_TOKEN)
            let path = '/projects/'+id+'/repository/tags'
            const URL = process.env.GITLAB_URL + path
            const config = {
                headers: {
                    'Private-Token': process.env.GITLAB_TOKEN
                }
            }

            let response = await axios.get(URL,config)

            if(response.status = 200){
                console.log("projectTags", response.data)
                resolve(response.data)
            }


        } catch (e) {
            reject(e)
        }

    })
}
