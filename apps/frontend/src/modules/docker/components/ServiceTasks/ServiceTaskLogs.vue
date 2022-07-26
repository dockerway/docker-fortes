<template>
    <v-container class="fullscreen-wrapper">
        <v-row align="center">
            <v-col cols="12" sm="3">
                <v-switch
                    label="Auto refresh"
                    v-model="refresh"
                    @change="refreshLogs()"
                    inset
                ></v-switch>
            </v-col>
            <v-col cols="12" sm="3">
                <v-switch
                    label="Display timestamps"
                    v-model="filters.timestamps"
                    inset
                ></v-switch>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12" sm="6">
                <v-slider
                    v-model="refreshRate"
                    :min="1" :max="60"
                    label="Regresh Rate"
                    thumb-color="green"
                    thumb-label="always"
                ></v-slider>
            </v-col>
        </v-row>


        <v-data-table
            :items="data"
            :headers="[{text:'timestamp',value:'timestamp'},{text:'text',value:'text'} ]"
            :items-per-page="100"
            hide-default-footer
            :loading="loading"
        >
            <template v-slot:item.timestamp="{item}">
            {{ item.timestamp }}
            </template>
        </v-data-table>
    </v-container>
</template>

<script>
import DockerProvider from "@/modules/docker/providers/DockerProvider";
import {Dayjs} from "@dracul/dayjs-frontend"

export default {
    name: "ServiceTaskLogs",
    props: {
        task: {type: Object}
    },
    data(){
        return {
            filters: {
                details: false, //default false
                follow: false, //default false
                stdout: true, //default false
                stderr: true, //default false
                since: 0, //default 0 (int)
                timestamps: false, //default false
                tail: "100" //int or default "all"
            },
            refresh: true,
            refreshRate: 5,
            loading: false,
            data: [],
            orderBy: 'timestamp'
        }
    },
    computed: {
        getTaskId(){
            return this.task.id
        },
        formatDate() {
            return date => {
                return Dayjs(date).format("YYYY-MM-DD HH:mm:ss")
            }
        },
    },
    created() {
        this.fetchLogs()
    },
    methods: {
        fetchLogs() {
            this.loading = true
            console.log("filters",this.filters)
            DockerProvider.serviceTaskLogs(this.getTaskId, this.filters)
                .then(r => {
                    console.log("res:",r)
                    this.data =  []
                    this.data = r.data.serviceTaskLogs
                    this.refreshLogs()
                }).finally(() => this.loading = false)
        },
        refreshLogs() {
            if (this.refresh) {
                setTimeout(() => this.fetchLogs(), (this.refreshRate * 1000))
            }
        },

    }
}
</script>