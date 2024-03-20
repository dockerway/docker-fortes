
import merge from 'deepmerge'

import PrimaryPageMessages from './PrimaryPageMessages'
import ClusterVisualizerMessages from './ClusterVisualizerMessages'

const messages = merge.all([
    PrimaryPageMessages,
    ClusterVisualizerMessages
])

export default messages