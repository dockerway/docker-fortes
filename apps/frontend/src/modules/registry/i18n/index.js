
import merge from 'deepmerge'
import ImageMessages from './messages/ImageMessages'

const messages = merge.all([
    ImageMessages,
])

export default messages;
