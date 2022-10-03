
import merge from 'deepmerge'
import AuditMessages from './messages/AuditMessages'
import DockerMessages from './messages/DockerMessages'
import RoleMessages from './messages/RoleMessages'

const messages = merge.all([
    AuditMessages,
    DockerMessages,
    RoleMessages
])

export default messages;
