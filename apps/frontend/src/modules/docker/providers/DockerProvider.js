import apolloClient from '../../../apollo'

class DockerProvider {

    constructor() {
        this.gqlc = null
    }

    setGqlc(gqlc) {
        this.gqlc = gqlc
    }

    dockerVersion() {
        return this.gqlc.query({
            query: require('./gql/dockerVersion.graphql')
        })
    }

    fetchStack() {
        return this.gqlc.query({
            query: require('./gql/fetchStack.graphql'),
            fetchPolicy: "network-only"
        })
    }

    fetchService(stack = null) {
        return this.gqlc.query({
            query: require('./gql/fetchService.graphql'),
            variables: {stack},
            fetchPolicy: "network-only"
        })
    }

    fetchContainer(service = null) {
        return this.gqlc.query({
            query: require('./gql/fetchContainer.graphql'),
            variables: {service},
            fetchPolicy: "network-only"
        })
    }


    serviceLogs(service = null) {
        return this.gqlc.query({
            query: require('./gql/serviceLogs.graphql'),
            variables: {service},
            fetchPolicy: "network-only"
        })
    }
}

const dockerProvider = new DockerProvider()
dockerProvider.setGqlc(apolloClient)
export default dockerProvider
