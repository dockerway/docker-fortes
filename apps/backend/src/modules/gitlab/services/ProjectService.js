import axios from 'axios'


export const fetchProject = function (page = 1, per_page= 10) {
    return new Promise(async (resolve, reject) => {
        try {
            console.log(process.env.GITLAB_URL, process.env.GITLAB_TOKEN)
            let path = '/projects/'
            const URL = process.env.GITLAB_URL + path
            const config = {
                headers: {
                    'Private-Token': process.env.GITLAB_TOKEN
                },
                params: {
                    page: page,
                    per_page: per_page
                }
            }

            let response = await axios.get(URL,config)

            if(response.status = 200){
                let items =response.data
                let totalItems = parseInt(response.headers['x-total'])
                //console.log("HEADERS",response.headers)
                let r = {totalItems,items}
                //console.log("projects", r)
                resolve(r)
            }


        } catch (e) {
            reject(e)
        }

    })
}

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
