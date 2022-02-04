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

    fetchTask(service = null) {
        return this.gqlc.query({
            query: require('./gql/fetchTask.graphql'),
            variables: {service},
            fetchPolicy: "network-only"
        })
    }

    fetchNode(service = null) {
        return this.gqlc.query({
            query: require('./gql/fetchNode.graphql'),
            variables: {service},
            fetchPolicy: "network-only"
        })
    }

    findNode(id = null) {
        return this.gqlc.query({
            query: require('./gql/findNode.graphql'),
            variables: {id},
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
