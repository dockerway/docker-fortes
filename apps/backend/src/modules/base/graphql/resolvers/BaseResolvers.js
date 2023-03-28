export default {
    Query: {
        ping: (_,{},{user}) => {
            return Promise.resolve({status: true})
        },
        pingDelayed: (parent, {}, {req}) => {
            return new Promise(resolve => {
                setTimeout(() => {
                    resolve({status: true})
                }, 400)
            })
        },
        pingTimeout: (parent, {}, {req}) => {
            console.time("ping")
            console.log("PingDelayed started req.connection.timeout:", req.connection.timeout)
            return new Promise(resolve => {
                setTimeout(() => {
                    console.log("PingDelayed resolved")
                    console.timeEnd("ping")
                    resolve({status: true})
                }, 480000)
            })
        },
        errorDemo: (_) => {
            throw new ForbiddenError("Not authorized")
        }
    }
}
