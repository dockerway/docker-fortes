<template>
    <v-card-text>
        <v-card>
            <v-card-title>{{ $t('docker.clusterInformationPage.primaryPage.options.title') }}</v-card-title>
            <v-card-subtitle>{{ $t('docker.clusterInformationPage.primaryPage.options.subtitle') }}</v-card-subtitle>
            <v-row class="ma-0 pa-0" align="center">
                <v-col cols="12" md="3">
                    <v-switch 
                        :label="$t('docker.clusterInformationPage.primaryPage.options.onlyDisplayRunningTasks')"
                        v-model="displayOptions.onlyDisplayRunningTasks"
                    ></v-switch>
                </v-col>
                <v-col cols="12" md="3">
                    <v-switch 
                        :label="$t('docker.clusterInformationPage.primaryPage.options.displayNodeLabels')"
                        v-model="displayOptions.displayNodeLabels"    
                    ></v-switch>
                </v-col>
                <v-col cols="12" md="6">
                    <refresh-options
                        v-model="refreshOptionsComputed"
                    ></refresh-options>
                </v-col>
            </v-row>
        </v-card>
    </v-card-text>
</template>

<script>
    import RefreshOptions from './RefreshOptions.vue'

    import z from 'zod'

    const DisplayOptionsSchema = z.object({
        onlyDisplayRunningTasks: z.boolean(),
        displayNodeLabels: z.boolean()
    }).strict()

    export default {
        name: 'DisplayOptions',
        components: {
            RefreshOptions
        },
        props: {
            value: {
                type: Object,
                required: true,
                validator: (value) => DisplayOptionsSchema.parse(value)
            },
            refreshOptions: {
                type: Object,
                required: true
            }
        },
        computed: {
            displayOptions: {
                get(){
                    return this.value
                },
                set(value){
                    this.$emit('input', value)
                }
            },
            refreshOptionsComputed: {
                get(){
                    return this.refreshOptions
                },
                set(value){
                    this.$emit('update:refreshOptions', value)
                }
            }
        },
    }
</script>

<style lang="scss" scoped>

</style>