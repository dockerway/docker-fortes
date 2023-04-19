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

    fetchServiceById(id = null) {
        return this.gqlc.query({
            query: require('./gql/fetchServiceById.graphql'),
            variables: {id},
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

    fetchTaskInspect(taskId = null) {
        return this.gqlc.query({
            query: require('./gql/fetchTaskInspect.graphql'),
            variables: {taskId},
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
    
    serviceTaskLogs(task = null, filters) {
        return this.gqlc.query({
            query: require('./gql/serviceTaskLogs.graphql'),
            variables: { task, filters },
            fetchPolicy: "network-only"
        })
    }

    dockerRestart(serviceId = null) {
        return this.gqlc.mutate({
            mutation: require('./gql/dockerRestart.graphql'),
            variables: {serviceId},
        })
    }

    dockerRestartMany(serviceIds = null) {
        return this.gqlc.mutate({
            mutation: require('./gql/dockerRestartMany.graphql'),
            variables: {serviceIds},
        })
    }

    dockerRemove(serviceId = null) {
        return this.gqlc.mutate({
            mutation: require('./gql/dockerRemove.graphql'),
            variables: {serviceId},
        })
    }

    dockerRemoveMany(serviceIds = null) {
        return this.gqlc.mutate({
            mutation: require('./gql/dockerRemoveMany.graphql'),
            variables: {serviceIds},
        })
    }

    fetchNetworks() {
        return this.gqlc.query({
            query: require('./gql/fetchNetworks.graphql'),
            fetchPolicy: "network-only"
        })
    }
}

const dockerProvider = new DockerProvider()
dockerProvider.setGqlc(apolloClient)
export default dockerProvider
