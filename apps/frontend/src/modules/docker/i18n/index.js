
import merge from 'deepmerge'
import AuditMessages from './messages/AuditMessages'
import DockerMessages from './messages/DockerMessages'

const messages = merge.all([
    AuditMessages,
    DockerMessages
])

export default messages;
