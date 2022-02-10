import apolloClient from '../../../apollo'

class GitlabProvider {

    constructor() {
        this.gqlc = null
    }

    setGqlc(gqlc) {
        this.gqlc = gqlc
    }


    projectTags(id = null) {
        return this.gqlc.query({
            query: require('./gql/Project/projectTags.graphql'),
            variables: {id},
            fetchPolicy: "network-only"
        })
    }

    fetchProject(page, per_page) {
        return this.gqlc.query({
            query: require('./gql/Project/fetchProject.graphql'),
            variables: {page, per_page},
            fetchPolicy: "network-only"
        })
    }

}

const gitlabProvider = new GitlabProvider()
gitlabProvider.setGqlc(apolloClient)
export default gitlabProvider
