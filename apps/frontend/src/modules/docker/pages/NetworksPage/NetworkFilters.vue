<template>
    <v-card>
      <v-card-subtitle>{{ this.$t("filters.titles.networks") }}</v-card-subtitle>
      <v-card-text class="pa-4">
        
        <v-row>

          <!-- Input -->
          <v-col cols="12" xs="12" sm="6" md="4">
            <v-row class="pa-6">
              <v-text-field 
                prependIcon="badge"
                :label="this.$t('docker.networks.name')"
                clearable
                v-model="networkName"
              />
            </v-row>
          </v-col>


          <v-col cols="12" xs="12" sm="6" md="4" class="pa-6">
            <v-autocomplete 
            :items = "[{text:'Si', value: true}, {text:'No', value: false}]"
            :label = "this.$t('docker.networks.attachable')"
            prependIcon = "attachment"
            clearable
            v-model="attachable"
            />
          </v-col>

          <v-col cols="12" xs="12" sm="6" md="4" class="pa-6">
            <v-autocomplete 
            prependIcon = "wifi"
            :label = "this.$t('docker.networks.driver')"
            :items = "['overlay', 'bridge', 'host']"
            clearable
            v-model="networkDriver"
            />
          </v-col>
        </v-row>

        <v-row>
          
        <v-col cols="12" xs="12" sm="6" md="4" class="pa-6">
          <date-input
            :allowed-dates="sinceDates"
            :label = "this.$t('filters.since')"
            v-model="sinceDate"
          />
        </v-col>

        <v-col cols="12" xs="12" sm="6" md="4" class="pa-6">
          <date-input
            :label = "this.$t('filters.until')"
            :allowed-dates="untilDates"
            v-model="untilDate"
          />
        </v-col>

          <!-- Input -->
          <v-col cols="12" xs="12" sm="6" md="4">
            <v-row class="pa-6">
              <v-text-field
                clearable
                prepend-icon="pin" 
                :label="this.$t('docker.networks.ipv4ipamsubnet')"
                v-model="ipv4ipamsubnet"
              />
            </v-row>
          </v-col>


        </v-row>

        <!-- Actions -->
        <v-row>
          <v-col cols="12" class="text-right">
            <v-btn small text color="secondary" @click="cleanFilters">
              {{ $t('filters.reset') }}
            </v-btn>
            <v-btn 
              small 
              color="secondary" 
              :loading="filterLoading" 
              @click="setFilters"
            >
              {{ $t("filters.apply") }}
            </v-btn>
          </v-col>
        </v-row>


      </v-card-text>
    </v-card>
  </template>
  
  <script>
  import { DateInput, Dayjs } from "@dracul/dayjs-frontend"
  
  export default {
    name: 'NetworkFilters',
    props: {
      filterLoading: {
        type: Boolean,
        default: false
      }
    },
    components: { DateInput},
    data() {
      return {
        networkName: '',
        attachable: '',

        networkDriver: '',
        ipv4ipamsubnet: '',

        sinceDate: Dayjs().subtract(1, 'year').format('YYYY-MM-DD'),
        untilDate: Dayjs().add(1, 'day').format('YYYY-MM-DD'),
      }
    },
    computed: {
      filters() {
        const filters = {
          sinceDate: this.sinceDate ,
          untilDate: this.untilDate ,

          networkName: this.networkName ,
          attachable: this.attachable ,

          networkDriver: this.networkDriver ,
          ipv4ipamsubnet: this.ipv4ipamsubnet ,
        }

        if (this.sinceDate) filters.sinceDate = this.sinceDate
        if (this.untilDate) filters.untilDate = this.untilDate

        return filters
    },

    untilDates(val) {
      return (val) => {
        return (this.sinceDate) ? Dayjs().add(1, 'day').isAfter(val) && Dayjs(this.sinceDate).isBefore(val) : Dayjs().add(1, 'day').isAfter(val)
      }
    },

    sinceDates(val) {
      return (val) => {
        return Dayjs().isAfter(val)
      }
    }
  },
    methods: {
      setFilters() {
        this.$emit('updateFilters', this.filters)
      },

      cleanFilters() {
        this.untilDate = ''
        this.sinceDate = ''

        this.networkName = ''
        this.ipv4ipamsubnet = ''
        
        this.attachable = null
        this.networkDriver = ''

        this.$emit('updateFilters', this.filters)
      }
  }
}
  </script>