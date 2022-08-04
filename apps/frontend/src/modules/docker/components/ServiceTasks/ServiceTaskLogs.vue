<template>
    <v-container class="fullscreen-wrapper">
        <v-row  align="center">
            <v-col cols="12" md="2" sm="4">
                <v-combobox
                    label="Filtrar"
                    v-model="filters.since"
                    :items="timeOptions"
                    outlined
                    hide-selected
                    persistent-hint
                ></v-combobox>
            </v-col>
            <v-col cols="12" md="2" sm="4">
                <v-text-field
                    label="Buscar"
                    v-model="filters.fetch"
                    outlined
                ></v-text-field>
            </v-col>
            <v-col cols="12" md="2" sm="4">
                <v-text-field
                    label="Cantidad de lineas"
                    v-model="filters.tail"
                    type="number"
                    outlined
                ></v-text-field>
            </v-col>
            <v-col cols="12" md="2" sm="4">
                <v-switch
                    label="Auto refresh"
                    v-model="refresh"
                    @change="refreshLogs()"
                    inset
                ></v-switch>
            </v-col>
            <v-col cols="12" md="2" sm="4">
                <v-switch
                    label="Display timestamps"
                    v-model="filters.timestamps"
                    inset
                ></v-switch>
            </v-col>
        </v-row>
        <v-row  align="center">
            <v-col cols="12" md="10" sm="8">
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
                timestamps: false, //default false
                tail: 100, //int or default "all"
                since: 'Todos los logs', //default 0 (int)
                fetch: ''
            },
            timeOptions: [
                'Todos los logs','Último día','Últimas 4 horas','Última hora','30 minutos'
            ],
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
    unmounted() {
        this.data = [],
        /* this.filters = {
            details: false, //default false
            follow: false, //default false
            stdout: true, //default false
            stderr: true, //default false
            since: 0, //default 0 (int)
            timestamps: false, //default false
            tail: 100 //int or default "all"
        }, */
        console.log("closeLogs")
    },
    watch: {
        // whenever question changes, this function will run
        filters() {
            this.fetchLogs()
        }
    },
    methods: {
        sinceInMinutes(since){
            switch (since) {
                case 'Todos los logs':
                    return '0'
                case 'Último día':
                    return '1440' 
                case 'Últimas 4 horas':
                    return '240'
                case 'Última hora':
                    return '60'      
                case '30 minutos':
                    return '30'         
                default:
                    return '0'
            }
        },
        async fetchLogs() {
            this.loading = true
            console.log("filters",this.filters)
            this.filters.tail = this.filters.tail.toString()
            this.filters.since = await this.sinceInMinutes(this.filters.since)
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