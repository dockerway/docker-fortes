import { ResponseTimeMiddleware, RequestMiddleware, GqlErrorLog, GqlResponseLog } from '@dracul/logger-backend';
import { jwtMiddleware, corsMiddleware, rbacMiddleware, sessionMiddleware } from '@dracul/user-backend';
import { DefaultLogger } from "@dracul/logger-backend";
import ErrorHandlerMiddleware from "./middlewares/ErrorHandlerMiddleware";
import { ApolloServer, GraphQLExtension } from 'apollo-server-express'
import { graphqlUploadExpress } from 'graphql-upload';
import { config } from 'dotenv';
import express from 'express';

config()
DefaultLogger.info("Starting APP")

import { startWebSocketServerWithAgent } from './modules/docker/services/AgentWsService';
import startLogWebSocketServer  from './modules/docker/services/LogWebSocketService';
import { resolvers, typeDefs } from './ModulesMerge'
import { initService } from "./init/InitService";
import { mongoConnect } from './MongoDb';
import apiRoutes from './RoutesMerge';
import server from './HttpServer';
import path from 'path';

mongoConnect()
startWebSocketServerWithAgent()
startLogWebSocketServer()

const app = express()
app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }))
app.use(corsMiddleware)
app.use(express.json())
app.use(jwtMiddleware)


app.use(function (err, _req, _res, next) {
    if (err && err.name === 'UnauthorizedError') {
        DefaultLogger.warn(err.message)
    }
    next()
})



app.use(RequestMiddleware)
app.use(ResponseTimeMiddleware)

app.use(rbacMiddleware)
app.use(sessionMiddleware)

GraphQLExtension.didEncounterErrors

const apolloServer = new ApolloServer({
    uploads: false,
    typeDefs,
    resolvers,
    context: ({ req }) => {
        return { user: req.user, rbac: req.rbac, req }
    },
    plugins: [
        {
            requestDidStart(requestContext) {
                return {
                    didEncounterErrors(requestContext) {
                        GqlErrorLog(requestContext)
                    },
                    willSendResponse(requestContext) {
                        GqlResponseLog(requestContext)
                    }
                }
            }
        }
    ]
})


apolloServer.applyMiddleware({ app })

//API REST
app.use('/api', apiRoutes)

//STATIC FILES
app.use('/media/avatar', express.static('media/avatar'))
app.use('/media/logo', express.static('media/logo'))
app.use('/media/export', express.static('media/export'))


//Endpoint for monitoring
app.get('/status', function (req, res) {
    res.send("RUNNING")
})

//Web Static Files for Production
app.use('/', express.static('web', { index: "index.html" }))
app.use('*', function (request, response) {
    response.sendFile(path.resolve(__dirname, 'web/index.html'))
})

app.use(ErrorHandlerMiddleware)

//initialize permissions, roles, users, customs, seeds
initService().then(() => {

    const PORT = process.env.APP_PORT ? process.env.APP_PORT : "5000"
    const URL = process.env.APP_API_URL ? process.env.APP_API_URL : "http://localhost" + PORT

    server.on('request', app)
    server.listen(PORT, () => {
        DefaultLogger.info(`Web Server started: ${URL}`)
        DefaultLogger.info(`Graphql Server ready: ${URL}${apolloServer.graphqlPath}`)
        DefaultLogger.info(`WebSockets Server ready: ws://localhost:${PORT}`)
    })

    server.setTimeout(420000)

}).catch(err => {
    DefaultLogger.error(err.message, err)
})
