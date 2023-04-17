<template>
    <v-container fluid>
      
      <v-card>
        <v-card-title>
          {{ this.$t('menu.networks') }}

          <v-spacer/>

          <v-btn
            plain
            icon
            dark 
            @click="fetchNetworks"
          >
            <v-icon>refresh</v-icon>
          </v-btn>
        </v-card-title>

        <network-filters
          @updateFilters="fetchNetworksByFilters"
        />
        <v-divider/>
      </v-card>



      <v-card class="rounded-0">
        <v-card-text>
          <v-data-table
            dense
            :items="networks"
            :headers="headers"
            :items-per-page.sync="itemsPerPage"
            :footer-props="{ itemsPerPageOptions: [5, 10, 25, 50,100] }"
          >

            <template v-slot:item.leader="{ item }">
              <v-icon :color="item.leader ? 'green' : 'grey'">
              {{item.leader ? 'done' : 'dangerous'}}
              </v-icon>
            </template>

          </v-data-table>
        </v-card-text>
      </v-card>

    </v-container>
</template>

<script>
import DockerProvider from "@/modules/docker/providers/DockerProvider";
import { Dayjs } from "@dracul/dayjs-frontend";
import NetworkFilters from "./NetworkFilters.vue";

export default {
  name: "NetworksPage",
  data() {
    return {
      networks: [],
      itemsPerPage: 25,
    }
  },
  components: {NetworkFilters},
  computed: {
    headers() {
      return [
        {text: this.$t('docker.networks.name'), value: 'Name'},
        {text: this.$t('docker.networks.dateOfCreation'), value: 'Created'},
        {text: this.$t('docker.networks.driver'), value: 'Driver'},
        {text: this.$t('docker.networks.attachable'), value: 'Attachable'},
        {text: this.$t('docker.networks.ipamdriver'), value: 'IPAM.Driver'},
        {text: this.$t('docker.networks.ipv4ipamsubnet'), value: 'IPAM.Subnet'},
        {text: this.$t('docker.networks.ipv4ipamgateway'), value: 'IPAM.Gateway'}
      ]
    },
  },
  async created() {
    await this.fetchNetworks()
  },
  methods: {
    getNormalizedNetworks(networks){
      return networks.map(network => (
        {
          ...network,
          IPAM: {
            ...network.IPAM,
            Subnet: (network.IPAM.Config[0]) ? network.IPAM.Config[0].Subnet : null,
            Gateway: (network.IPAM.Config[0]) ? network.IPAM.Config[0].Gateway : null,
          },
          Created: Dayjs(network.Created).format('YYYY-MM-DD HH:mm')
        }
      ))
    },

    async fetchNetworks() {
      this.networks = this.getNormalizedNetworks((await DockerProvider.fetchNetworks()).data.fetchNetworks)
      console.log(this.networks)
    },

    async fetchNetworksByFilters(filters){
        console.log(filters)
      const dockerApiAcceptedFilters = {
        Driver: filters.networkDriver,
        Name: filters.networkName
      }

      const normalizedNetworks = this.getNormalizedNetworks((await DockerProvider.fetchNetworksByFilters(dockerApiAcceptedFilters)).data.fetchNetworksByFilters)
      const networksByFilters = normalizedNetworks.filter((network) => {

        const createdDate = Dayjs(network.Created)

        if (filters.untilDate && createdDate.isAfter(filters.untilDate)) return false
        if (filters.sinceDate && createdDate.isBefore(filters.sinceDate)) return false

        if (filters.attachable && network.Attachable !== filters.attachable) return false
        if (filters.ipv4ipamsubnet && !network.IPAM.Subnet || filters.ipv4ipamsubnet && !network.IPAM.Subnet.includes(filters.ipv4ipamsubnet)) return false

        return true
        
      })

      this.networks = networksByFilters
    }
  }
}
</script>

<style scoped>
.page-header{
  display: flex;
  justify-content: space-around;

  color: white;
}

v-icon{
  cursor: pointer;
}

v-icon:hover{
  color: rgb(117, 117, 117);
}

.refresh-button{
  padding: 0;
  height: fit-content;
}

.network-actions{
  display: flex;
}

.v-text-field{
  margin: 0 !important;
  padding: 0 !important;
}

.network-actions .network-container{
  display: flex;
}
</style>
