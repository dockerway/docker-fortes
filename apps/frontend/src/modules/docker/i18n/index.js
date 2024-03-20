
import merge from 'deepmerge'
import DockerMessages from './messages/DockerMessages'
import RoleMessages from './messages/RoleMessages'
import FiltersMessages from './messages/FiltersMessages'
import ClusterInformationPageMessages from './messages/ClusterInformationPageMessages'

const messages = merge.all([
    DockerMessages,
    RoleMessages,
    FiltersMessages,
    ClusterInformationPageMessages
])

export default messages;
