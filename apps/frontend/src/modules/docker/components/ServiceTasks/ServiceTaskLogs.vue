<template>
    <v-container class="fullscreen-wrapper">
        <v-row  align="center">
            <v-col cols="12" md="3" sm="4">
                <v-combobox
                    label="Filtrar"
                    v-model="since"
                    :items="timeOptions"
                    outlined
                    hide-selected
                    persistent-hint
                    @change="fetchLogs()"
                ></v-combobox>
            </v-col>
            <v-col cols="12" md="3" sm="4">
                <v-text-field
                    label="Buscar"
                    v-model="filters.fetch"
                    outlined
                    @change="fetchLogs()"
                ></v-text-field>
            </v-col>
            <v-col cols="12" md="2" sm="4">
                <v-text-field
                    label="Cantidad de lineas"
                    v-model="filters.tail"
                    type="number"
                    outlined
                    @keydown="validateLimit"
                    @change="fetchLogs()"
                    :max="limitLogLines"
                    min="0"
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
                    @change="fetchLogs()"
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
                    @change="fetchLogs()"
                ></v-slider>
            </v-col>
            <v-col cols="12" md="2" sm="8">
                <p class="text-left">
                    {{$t('docker.logs.numberOfLines')}} {{numberOfLines}}/{{filters.tail}}
                </p>
            </v-col>
        </v-row>


        <v-data-table
            class="virtual-scroll-table"
            :items-per-page="-1"
            :items="data"
            :headers="[{text    :'Logs',value:'text'} ]"
            hide-default-footer
            :loading="loading"
        >
        </v-data-table>
    </v-container>
</template>

<script>
import DockerProvider from "@/modules/docker/providers/DockerProvider";
import {Dayjs} from "@dracul/dayjs-frontend"
import { mapActions } from 'vuex';

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
                since: '0', //default 0 (int)
                fetch: ''
            },
            since: 'Todos los logs',
            timeOptions: [
                'Todos los logs','Último día','Últimas 4 horas','Última hora','30 minutos'
            ],
            refresh: true,
            refreshRate: 5,
            loading: false,
            data: [],
            orderBy: 'timestamp',
            numberOfLines: 0,
            limitLogLines: 10000
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
    async created() {
        this.fetchLogs()

        let settings = await this.loadSettings()

        settings = settings.map(setting =>{
            return setting.key == 'maxLogsLines' ? setting.value : null
        }).filter(s => s != null)
        this.limitLogLines = settings[0]

    },
    methods: {
        ...mapActions(['loadSettings']),
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
        validateLimit(){
            setTimeout(()=>{
                if(Number(this.filters.tail) > Number(this.limitLogLines)) this.filters.tail = this.limitLogLines
            }, 0)
        },
        async fetchLogs() {
            this.loading = true
            this.filters.tail = this.filters.tail.toString()
            this.filters.since = this.sinceInMinutes(this.since)
            if(this.getTaskId){
                DockerProvider.serviceTaskLogs(this.getTaskId, this.filters)
                    .then(r => {
                        this.data =  []
                        this.data = r.data.serviceTaskLogs
                        this.numberOfLines = r.data.serviceTaskLogs.length
                        this.refreshLogs()
                    }).finally(() => this.loading = false)
            }
        },
        refreshLogs() {
            if (this.refresh) {
                setTimeout(() => this.fetchLogs(), (this.refreshRate * 1000))
            }
        },

    }
}
</script>

<style>
.virtual-scroll-table{
        max-height: calc(100vh - 300px);
        overflow: auto;
}
</style>