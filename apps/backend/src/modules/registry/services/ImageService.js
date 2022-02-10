import axios from 'axios'

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
