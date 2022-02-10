
import merge from 'deepmerge'
import ProjectMessages from './messages/ProjectMessages'

const messages = merge.all([
    ProjectMessages,
])

export default messages;
