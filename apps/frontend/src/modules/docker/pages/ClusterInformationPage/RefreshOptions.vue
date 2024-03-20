<template>
    <v-row class="ma-0 pa-0" align="center">
        <v-col cols="12" md="6">
            <v-switch
                :label="$t('docker.clusterInformationPage.primaryPage.refresh.autoRefresh')"
                v-model="refreshOptions.autoRefresh"
            ></v-switch>
        </v-col>
        <v-col cols="12" md="6">
            <v-autocomplete
                :label="$t('docker.clusterInformationPage.primaryPage.refresh.refreshRate')"
                :items="['5s', '10s', '20s', '30s', '45s', '60s']"
                v-model="refreshOptions.refreshRate"
            ></v-autocomplete>
        </v-col>
    </v-row>
</template>

<script>
    import z from 'zod'

    const RefreshOptionsSchema = z.object({
        refreshRate: z.string(),
        autoRefresh: z.boolean()
    }).strict()

    export default {
        name: 'RefreshOptions',
        props: {
            value: {
                type: Object,
                required: true,
                validator: (value) => RefreshOptionsSchema.parse(value)
            }
        },
        computed: {
            refreshOptions: {
                get(){
                    return this.value
                },
                set(value){
                    this.$emit('input', value)
                }
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>