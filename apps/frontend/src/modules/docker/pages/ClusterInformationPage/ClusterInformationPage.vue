<template>
    <v-card class="pa-4">
        <v-card-title>{{ $t('docker.clusterInformationPage.primaryPage.title') }}</v-card-title>
        <v-card-subtitle>{{ $t('docker.clusterInformationPage.primaryPage.subtitle') }}</v-card-subtitle>

        <!-- Show loading if cluster basic data request is loading -->
        <v-progress-linear
            v-if="dockerNodesServicesAndTasksQuantityLoading"
            indeterminate
            color="primary"
        ></v-progress-linear>

        <!-- Show basic information -->
        <show-basic-information
            :nodes="nodesQuantity"
            :services="servicesQuantity"
            :tasks="tasksQuantity"
        ></show-basic-information>

        <!-- Display options -->
        
        <display-options
            v-model="displayOptions"
            :refreshOptions="refreshOptions"
            @update:refreshOptions="value => refreshOptions = value"
        ></display-options>

        <!-- Cluster visualizer -->
        
        <cluster-visualizer
            :fetchNodeAndTasksLoading="fetchNodeAndTasksLoading"
            :onlyDisplayRunningTasks="displayOptions.onlyDisplayRunningTasks"
            :displayNodeLabels="displayOptions.displayNodeLabels"
            :nodes="nodes"
            :deployTasks="deployTasks"
            @update:deployTasks="value => deployTasks = value"
        ></cluster-visualizer>
    </v-card>
</template>

<script>
    import ShowBasicInformation from './ShowBasicInformation.vue'
    import DisplayOptions from './DisplayOptions.vue'
    import ClusterVisualizer from './ClusterVisualizer.vue'
    import DockerProvider from '../../providers/DockerProvider'
    
    export default {
        name: 'ClusterInformationPage',

        components: {
            ShowBasicInformation,
            DisplayOptions,
            ClusterVisualizer
        },
        data: () => ({
            dockerNodesServicesAndTasksQuantityLoading: false,
            fetchNodeAndTasksLoading: false,
            nodesQuantity: 0,
            servicesQuantity: 0,
            tasksQuantity: 0,
            displayOptions: {
                onlyDisplayRunningTasks: false,
                displayNodeLabels: false
            },
            refreshOptions: {
                refreshRate: '5s',
                autoRefresh: false
            },
            nodes: [],
            fetchNodeAndTasksSetTimeout: null,
            deployTasks: []
        }),
        computed: {
            getRefresh(){
                return (this.refreshOptions.refreshRate.slice(0, -1) * 1000)
            },
            getAutoRefresh(){
                return this.refreshOptions.autoRefresh
            }
        },
        methods: {
            async fetchNodeAndTasks(){
                try {
                    this.fetchNodeAndTasksLoading = true
                    const {data: {fetchNodeAndTasks}} = await DockerProvider.fetchNodeAndTasks()
                    this.nodes = fetchNodeAndTasks.map(node => {
                        let deployTasks = false
                        if(this.deployTasks.length > 0){
                            this.deployTasks.findIndex(task => task === node.id) > -1 ? deployTasks = true : deployTasks = false
                        }
                        return {
                            ...node,
                            deployTasks: deployTasks
                        }
                    })
                } catch (error) {
                    console.error(error)
                } finally {
                    this.fetchNodeAndTasksLoading = false
                    this.fetchNodeAndTasksSetTimeout = setTimeout(async () => {
                        if(this.getAutoRefresh){
                            await this.fetchNodeAndTasks()
                        }
                    }, this.getRefresh);
                }
            },
            async dockerNodesServicesAndTasksQuantity(){
                try {
                    this.dockerNodesServicesAndTasksQuantityLoading = true
                    const {data: {dockerNodesServicesAndTasksQuantity}} = await DockerProvider.dockerNodesServicesAndTasksQuantity()
                    this.nodesQuantity = dockerNodesServicesAndTasksQuantity.nodesQuantity
                    this.servicesQuantity = dockerNodesServicesAndTasksQuantity.servicesQuantity
                    this.tasksQuantity = dockerNodesServicesAndTasksQuantity.tasksQuantity
                } catch (error) {
                    console.error(error)
                } finally {
                    this.dockerNodesServicesAndTasksQuantityLoading = false
                }
            }
        },
        mounted(){
            this.fetchNodeAndTasks()
            this.dockerNodesServicesAndTasksQuantity()
        },
        watch: {
            getAutoRefresh(){
                setTimeout(() => this.fetchNodeAndTasks(), 100)
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>