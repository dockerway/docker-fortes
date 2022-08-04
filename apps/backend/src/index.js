import ErrorHandlerMiddleware from "./middlewares/ErrorHandlerMiddleware";

require('dotenv').config();
import {DefaultLogger} from "@dracul/logger-backend";
DefaultLogger.info("Starting APP")


import initService from "./init/init-service";
import express from 'express';

const mongoConnect = require('./mongo-db')
mongoConnect()

import {ApolloServer, GraphQLExtension} from 'apollo-server-express'
import {resolvers, typeDefs} from './modules-merge'
import path from 'path'
import {jwtMiddleware, corsMiddleware, rbacMiddleware, sessionMiddleware} from '@dracul/user-backend'
import {ResponseTimeMiddleware,RequestMiddleware, GqlErrorLog, GqlResponseLog} from '@dracul/logger-backend'
import apiRoutes from './routes-merge'

const server = require('./http-server')
const startWebSocketServerWithAgent = require('./modules/docker/services/AgentWsService')

startWebSocketServerWithAgent()

const app = express();



app.use(corsMiddleware)
app.use(express.json())
app.use(jwtMiddleware)


app.use(function (err, req, res, next) {
    if(err && err.name === 'UnauthorizedError'){
        DefaultLogger.warn(err.message)
    }
    next()
});



app.use(RequestMiddleware)
app.use(ResponseTimeMiddleware)

//app.use(TimeoutMiddleware)

app.use(rbacMiddleware)
app.use(sessionMiddleware)

/* app.use((req, res, next)=>{
    throw new Error("ERROR")
})*/

GraphQLExtension.didEncounterErrors

const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({req}) => {
        return {user: req.user, rbac: req.rbac, req}
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
});


apolloServer.applyMiddleware({app})

//API REST
app.use('/api',apiRoutes)

//STATIC FILES
app.use('/media/avatar', express.static('media/avatar'));
app.use('/media/logo', express.static('media/logo'));
app.use('/media/export', express.static('media/export'));


//Endpoint for monitoring
app.get('/status', function (req, res) {
    res.send("RUNNING")
})

//Web Static Files for Production
app.use('/', express.static('web', {index: "index.html"}));
app.use('*',function (request, response) {
    response.sendFile(path.resolve(__dirname, 'web/index.html'));
});

app.use(ErrorHandlerMiddleware);

//initialize permissions, roles, users, customs, seeds
initService().then(() => {

    const PORT = process.env.APP_PORT ? process.env.APP_PORT : "5000"
    const URL = process.env.APP_API_URL ? process.env.APP_API_URL : "http://localhost" + PORT

    server.on('request', app);
    server.listen(PORT, () =>{
        DefaultLogger.info(`Web Server started: ${URL}`);
        DefaultLogger.info(`Graphql Server ready: ${URL}${apolloServer.graphqlPath}`);
        DefaultLogger.info(`WebSockets Server ready: ws://localhost:${PORT}`);
    });

    server.setTimeout(420000);

}).catch(err => {
    DefaultLogger.error(err.message, err)
})
