import apolloClient from '../../../apollo'

class RegistryProvider {

    constructor() {
        this.gqlc = null
    }

    setGqlc(gqlc) {
        this.gqlc = gqlc
    }

    fetchImage(rows = null) {
        return this.gqlc.query({
            query: require('./gql/Image/fetchImage.graphql'),
            variables: {rows},
            fetchPolicy: "network-only"
        })
    }

    imageTags(name) {
        return this.gqlc.query({
            query: require('./gql/Image/imageTags.graphql'),
            variables: {name},
            fetchPolicy: "network-only"
        })
    }

}

const registryProvider = new RegistryProvider()
registryProvider.setGqlc(apolloClient)
export default registryProvider
