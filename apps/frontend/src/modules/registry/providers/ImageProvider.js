import apolloClient from '../../../apollo'

class ImageProvider {

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

const imageProvider = new ImageProvider()
imageProvider.setGqlc(apolloClient)
export default imageProvider
