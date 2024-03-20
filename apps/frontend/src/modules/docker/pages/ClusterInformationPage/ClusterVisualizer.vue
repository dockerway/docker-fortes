<template>
    <v-card-text>
        <v-card elevation="4">
            <v-row class="ma-0 pa-0" align="center">
                <v-col cols="10">
                    <v-card-title>
                        {{ $t('docker.clusterInformationPage.primaryPage.clusterVisualizer.title') }}
                    </v-card-title>
                    <v-card-subtitle>{{ $t('docker.clusterInformationPage.primaryPage.clusterVisualizer.subtitle') }}</v-card-subtitle>
                </v-col>
                <v-col cols="2" align="end">
                    <v-progress-circular
                        class="mr-2"
                        v-if="fetchNodeAndTasksLoading"
                        indeterminate
                        color="primary"
                    ></v-progress-circular>
                </v-col>
            </v-row>
            <v-simple-table>
                <thead>
                    <tr>
                        <template v-for="header of nodeHeaders">
                            <th class="text-center" :key="header.value" v-if="header.value === 'labels' ? displayNodeLabels : true">
                                {{ header.text }}
                            </th>
                        </template>
                        <th>
                            {{ $t('common.actions') }}
                        </th>
                    </tr>
                </thead>
                <tbody :key="index" v-for="(node, index) of nodes">
                    <tr>
                        <template
                            v-for="header of nodeHeaders"
                        >
                            <td class="text-center" :key="header.value" v-if="header.value === 'labels' ? displayNodeLabels : true">
                                <template v-if="header.value === 'state'">
                                    <v-chip :color="getNodeStatusColor(node.state)" dark>{{ node.state }}</v-chip>
                                </template>
                                <template v-else-if="header.value === 'resources'">
                                    {{ Number(node.resources.NanoCPUs) / 1000000000 }} CPU / {{ (Number(node.resources.MemoryBytes) / 1024 / 1024 / 1024).toFixed(2) }} GB
                                </template>
                                <template v-else-if="header.value === 'labels'">
                                    <v-tooltip
                                        v-for="label of Object.keys(JSON.parse(node.labels))" 
                                        :key="label"
                                        bottom
                                    >
                                        <template v-slot:activator="{ on: tooltip }">
                                            <v-chip
                                                color="blue darken-3"
                                                dark
                                                v-on="{ ...tooltip }"
                                            >
                                                {{ label }}
                                            </v-chip>
                                        </template>
                                        <span>{{JSON.parse(node.labels)[label]}}</span>
                                    </v-tooltip>
                                </template>
                                <template v-else>
                                    {{ node[header.value] }}
                                </template>
                            </td>
                        </template>
                        <td class="text-left">
                            <v-btn icon @click="deployDown(node)">
                                <v-icon>{{node.deployTasks ? 'mdi-pan-up' : 'mdi-pan-down'}}</v-icon>
                            </v-btn>
                        </td>
                    </tr>
                    <tr v-if="node.deployTasks">
                        <td :colspan="displayNodeLabels ? '6' : '5'">
                            <v-card class="ma-2 pa-4" outlined elevation="0">
                                <v-simple-table fixed-header :height="deployTasksTableHeight(node)">
                                    <thead>
                                        <tr>
                                            <th class="text-left" v-for="taskH of taskHeaders" :key="taskH.value">
                                                {{ taskH.text }}
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="task of node.tasks" :key="task.id">
                                            <template
                                                v-for="taskH of taskHeaders"
                                            >
                                                <td 
                                                    v-if="onlyDisplayRunningTasks ? task.state === 'running' : true"
                                                    class="text-left" 
                                                    :key="taskH.value"
                                                >
                                                    <template v-if="taskH.value === 'image.name'">
                                                        {{ task.image.name }}
                                                    </template>
                                                    <template v-else-if="taskH.value === 'state'">
                                                        <v-chip :color="getStateColor(task.state)" dark>{{ task.state }}</v-chip>
                                                    </template>
                                                    <template v-else-if="taskH.value === 'image.fullname'">
                                                        {{ task.image.fullname }}
                                                    </template>
                                                    <template v-else-if="taskH.value === 'updatedAt'">
                                                        {{ dayjs(task.updatedAt).format('DD-MM-YYYY HH:mm:ss') }}
                                                    </template>
                                                    <template v-else>
                                                        {{ task[taskH.value] }}
                                                    </template>
                                                </td>
                                            </template>
                                        </tr>
                                    </tbody>
                                </v-simple-table>
                            </v-card>
                        </td>
                    </tr>
                </tbody>
            </v-simple-table>
        </v-card>
    </v-card-text>
</template>

<script>
    import dayjs from 'dayjs'

    export default {
        name: 'ClusterVisualizer',
        props: {
            nodes: {
                type: Array,
                required: true
            },
            deployTasks: {
                type: Array,
                required: true
            },
            onlyDisplayRunningTasks: {
                type: Boolean,
                required: true
            },
            displayNodeLabels: {
                type: Boolean,
                required: true
            },
            fetchNodeAndTasksLoading: {
                type: Boolean,
                required: true
            }
        },
        data: () => ({
            dayjs
        }),
        computed: {
            nodeHeaders(){
                return [
                    {
                        text: this.$t('docker.clusterInformationPage.clusterVisualizer.nodeHeaders.status'),
                        value: 'state',
                    },
                    {
                        text: this.$t('docker.clusterInformationPage.clusterVisualizer.nodeHeaders.hostname'),
                        value: 'hostname'
                    },
                    {
                        text: this.$t('docker.clusterInformationPage.clusterVisualizer.nodeHeaders.role'),
                        value: 'role'
                    },
                    {
                        text: this.$t('docker.clusterInformationPage.clusterVisualizer.nodeHeaders.cpuMemory'),
                        value: 'resources'
                    },
                    {
                        text: this.$t('docker.clusterInformationPage.clusterVisualizer.nodeHeaders.labels'),
                        value: 'labels'
                    }
                ]
            },
            taskHeaders(){
                return [
                    {
                        text: this.$t('docker.clusterInformationPage.clusterVisualizer.taskHeaders.state'),
                        value: 'state',
                    },
                    {
                        text: this.$t('docker.clusterInformationPage.clusterVisualizer.taskHeaders.updatedAt'),
                        value: 'updatedAt'
                    },
                    {
                        text: this.$t('docker.clusterInformationPage.clusterVisualizer.taskHeaders.name'),
                        value: 'image.name',
                    },
                    {
                        text: this.$t('docker.clusterInformationPage.clusterVisualizer.taskHeaders.image'),
                        value: 'image.fullname'
                    }
                ]  
            },
            getStateColor() {
                return state => {
                    switch (state) {
                    case 'running':
                        return 'green darken-3'
                    case 'rejected':
                        return 'red darken-3'
                    case 'shutdown':
                        return 'red darken-3'
                    case 'failed':
                        return 'red darken-3'
                    case 'starting':
                        return 'teal darken-3'
                    case 'complete':
                        return 'blue darken-3'
                    case 'restarting':
                        return 'yellow darken-3'
                    case 'paused':
                        return 'cyan darken-3'
                    case 'exited':
                        return 'purple darken-3'
                    case 'dead':
                        return 'black darken-3'
                    case 'created':
                        return 'indigo darken-3'
                    default:
                        return 'grey darken-3'
                    }
                }
            },
            getNodeStatusColor(){
                return state => {
                    switch (state) {
                        case 'ready':
                            return 'green darken-3'
                        case 'active':
                            return 'blue darken-3'
                        case 'down':
                            return 'red darken-3'
                        default:
                            return 'grey darken-3'
                    }
                }
            },
            deployTasksTableHeight(){
                return node => {
                    let height = ''
                    const taskLength = node.tasks.filter(task => this.onlyDisplayRunningTasks ? task.state === 'running': true).length
                    if(taskLength && taskLength > 5){
                        height = '300px'
                    }
                    return height
                }
            }
        },
        methods: {
            deployDown(node) {
                if(this.deployTasks.findIndex(task => task === node.id) === -1){
                    this.$emit('update:deployTasks', [...this.deployTasks, node.id])
                }else{
                    this.$emit('update:deployTasks', this.deployTasks.filter(task => task !== node.id))
                }
                node.deployTasks = !node.deployTasks
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>