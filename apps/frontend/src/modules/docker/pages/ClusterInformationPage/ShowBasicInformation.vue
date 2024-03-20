<template>
    <v-card-text>
        <v-card>
            <v-divider class="my-4"></v-divider>
            <v-row class="ma-0 pa-0" justify="space-between">
                <b class="ml-3">{{ $t('docker.clusterInformationPage.primaryPage.basicInformation.nodes') }}</b>
                <p class="mr-3">{{ nodes }}</p>
            </v-row>
            <v-divider class="mb-4"></v-divider>
            <v-row class="ma-0 pa-0" justify="space-between">
                <b class="ml-3">{{ $t('docker.clusterInformationPage.primaryPage.basicInformation.services') }}</b>
                <p class="mr-3">{{ services }}</p>
            </v-row>
            <v-divider class="mb-4"></v-divider>
            <v-row class="ma-0 pa-0" justify="space-between">
                <b class="ml-3">{{ $t('docker.clusterInformationPage.primaryPage.basicInformation.tasks') }}</b>
                <p class="mr-3">{{ tasks }}</p>
            </v-row>
            <v-divider class="mb-4"></v-divider>
        </v-card>
    </v-card-text>
</template>

<script>
    export default {
        name: 'ShowBasicInformation',
        props: {
            nodes: {
                type: Number,
                required: true
            },
            services: {
                type: Number,
                required: true
            },
            tasks: {
                type: Number,
                required: true
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>