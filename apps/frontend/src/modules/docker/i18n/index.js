
import merge from 'deepmerge'
import DockerMessages from './messages/DockerMessages'
import RoleMessages from './messages/RoleMessages'
import FiltersMessages from './messages/FiltersMessages'

const messages = merge.all([
    DockerMessages,
    RoleMessages,
    FiltersMessages
])

export default messages;
