import apolloClient from '../../../apollo'
class DockerProvider {

    constructor() {
        this.gqlc = null
    }

    setGqlc(gqlc){
        this.gqlc = gqlc
    }

    dockerVersion(){
        return this.gqlc.query({
            query: require('./gql/dockerVersion.graphql')
        })
    }

    fetchStack(){
        return this.gqlc.query({
            query: require('./gql/fetchStack.graphql')
        })
    }

    fetchService(stack = null){
        return this.gqlc.query({
            query: require('./gql/fetchService.graphql'),
            variables: {stack}
        })
    }
}
const dockerProvider = new DockerProvider()
dockerProvider.setGqlc(apolloClient)
export default dockerProvider
