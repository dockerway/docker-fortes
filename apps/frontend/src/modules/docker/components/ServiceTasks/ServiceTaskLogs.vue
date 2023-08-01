<template>
    <v-container class="fullscreen-wrapper">
        <v-row align="center">
            <v-col cols="12" md="3" sm="4">
                <v-combobox label="Filtrar" v-model="since" :items="timeOptions" outlined hide-selected persistent-hint
                    @change="fetchLogs()"
                />
            </v-col>
            <v-col cols="12" md="3" sm="4">
                <v-text-field label="Buscar" v-model="filters.fetch" outlined 
                    @change="fetchLogs()"
                />
            </v-col>
            <v-col cols="12" md="2" sm="4">
                <v-text-field label="Cantidad de lineas" v-model="filters.tail" type="number" outlined
                    @keydown="validateLimit" @change="fetchLogs()" :max="limitLogLines" min="0"
                />
            </v-col>
            <v-col cols="12" md="2" sm="4">
                <v-switch label="Auto refresh" v-model="refresh" 
                    @change="refreshLogs()" inset
                />
            </v-col>
            <v-col cols="12" md="2" sm="4">
                <v-switch label="Display timestamps" v-model="filters.timestamps" inset 
                    @change="fetchLogs()"
                />
            </v-col>
        </v-row>
        <v-row align="center">
            <v-col cols="12" md="10" sm="8">
                <v-slider v-model="refreshRate" :min="1" :max="60" label="Regresh Rate" thumb-color="green"
                    thumb-label="always" @change="fetchLogs()"
                />
            </v-col>
            <v-col cols="12" md="2" sm="8">
                <p class="text-left">
                    {{ $t('docker.logs.numberOfLines') }} {{ numberOfLines }}/{{ filters.tail }}
                </p>
            </v-col>
        </v-row>


        <v-data-table class="virtual-scroll-table" :items-per-page="-1" :items="data"
            :headers="[{ text: 'Logs', value: 'text' }]" hide-default-footer :loading="loading">
        </v-data-table>
    </v-container>
</template>

<script>
import DockerProvider from "@/modules/docker/providers/DockerProvider";
import { Dayjs } from "@dracul/dayjs-frontend"
import { mapActions } from 'vuex';

export default {
    name: "ServiceTaskLogs",
    props: {
        task: { type: Object }
    },
    data() {
        return {
            filters: {
                timestamps: false, //default false
                tail: 100, //int or default "all"
                since: '0', //default 0 (int)
                fetch: ''
            },
            since: 'Todos los logs',
            timeOptions: [
                'Todos los logs', 'Último día', 'Últimas 4 horas', 'Última hora', '30 minutos'
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
        getTaskId() {
            return this.task.id
        },
        formatDate() {
            return date => Dayjs(date).format("YYYY-MM-DD HH:mm:ss")
        },
    },
    async created() {
        await this.loadSettingsAndSetLimitLogLines()
        await this.fetchLogs()
    },
    methods: {
        ...mapActions(['loadSettings']),
        sinceInMinutes(since) {
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
        validateLimit() {
            const tailInput = Number(this.filters.tail)
            const maxLimit = Number(this.limitLogLines)

            if (tailInput > maxLimit) this.filters.tail = maxLimit
        },

        async fetchLogs() {
            try {
                this.loading = true
                this.filters.tail = this.filters.tail.toString()
                this.filters.since = this.sinceInMinutes(this.since)

                if (this.getTaskId) {
                    this.data = (await DockerProvider.serviceTaskLogs(this.getTaskId, this.filters)).data.serviceTaskLogs
                    this.numberOfLines = this.data.length
                    this.refreshLogs()
                }
            } catch (error) {
                console.error(`An error happened at the fetchLogs method: ${error.message ? error.message : error}`)
            } finally {
                this.loading = false
            }
        },
        refreshLogs() {
            try {
                if (this.refresh) setTimeout(() => this.fetchLogs(), (this.refreshRate * 1000))
            } catch (error) {
                console.error(`An error happened at the refreshLogs method: ${error.message ? error.message : error}`)
            }
        },
        async loadSettingsAndSetLimitLogLines() {
            try {
                const settings = await this.loadSettings()
                const { value: limitLogLines } = settings.find(setting => setting.key === 'maxLogsLines') || {}

                this.limitLogLines = limitLogLines || 100
                this.filters.tail = this.limitLogLines
            } catch (error) {
                console.error(`An error happened at the loadSettingsAndSetLimitLogLines method: ${error.message ? error.message : error}`)
            }
        }
    }
}
</script>

<style>
.virtual-scroll-table {
    max-height: calc(100vh - 300px);
    overflow: auto;
}
</style>