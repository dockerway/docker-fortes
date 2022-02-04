import DockerMessages from './messages/DockerMessages'
import merge from 'deepmerge'

const messages = merge.all([DockerMessages])

export default messages
