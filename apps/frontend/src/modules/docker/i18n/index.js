
import merge from 'deepmerge'
import DockerMessages from './messages/DockerMessages'
import RoleMessages from './messages/RoleMessages'

const messages = merge.all([
    DockerMessages,
    RoleMessages
])

export default messages;
