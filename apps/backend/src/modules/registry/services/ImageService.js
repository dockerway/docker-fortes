import axios from 'axios'


export const fetchImage = function (rows= 1000) {
    return new Promise(async (resolve, reject) => {
        try {
            console.log(process.env.REGISTRY_URL)

            let path =  '/_catalog'
            const URL = process.env.REGISTRY_URL + path
            const config = {
                params:{
                    n:rows
                }
            }

            let response = await axios.get(URL,config)

            if(response.status = 200){
                //console.log("fetchImage", response.data)
                let r = response.data.repositories.map(i => ({name:i, tags: null}) )
               // console.log("fetchImage", r)
                resolve(r)
            }


        } catch (e) {
            reject(e)
        }

    })
}

export const imageTags = function (name) {
    return new Promise(async (resolve, reject) => {
        try {
            console.log(process.env.REGISTRY_URL)

            let path = name+ '/tags/list'
            const URL = process.env.REGISTRY_URL + path
            const config = {}

            let response = await axios.get(URL,config)

            if(response.status = 200){
                console.log("imageTags", response.data)
                resolve(response.data)
            }


        } catch (e) {
            reject(e)
        }

    })
}
