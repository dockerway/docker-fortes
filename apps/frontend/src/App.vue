<template>
   <!--CARGA LAYOUT DINAMICAMENTE SEGUN RUTA-->
    <component :is="getLayout" :menu="menu">

      <template v-slot:toolbar-left>
        <logo-toolbar/>
        <title-toolbar/>
      </template>

      <template v-slot:toolbar-right>
        <dashboard-button/>
        <app-bar-user-menu/>
      </template>
      <router-view></router-view>
      <error-snackbar></error-snackbar>
    </component>



</template>

<script>
import Layout from "./layout/Layout";
import TerminalLayout from "./layout/TerminalLayout";
import menuConfig from './menu-config'
import {DashboardButton, AppBarUserMenu} from '@dracul/user-frontend'
import {LogoToolbar, TitleToolbar} from '@dracul/customize-frontend'
import {mapGetters} from "vuex";
import ErrorSnackbar from "@/modules/base/components/ErrorSnackbar";

export default {
  name: 'App',
  components: {ErrorSnackbar, Layout,TerminalLayout, DashboardButton, AppBarUserMenu, LogoToolbar, TitleToolbar},
  data() {
    return {
      menu: menuConfig
    }
  },
  mounted() {
    this.$store.dispatch('checkAuth')
  },
  watch: {
    '$store.state.user.access_token': {
      handler(val) {
        if (val === null && this.$route.name != 'login') {
          this.$router.push({name: 'login'})
        }
      }
    }
  },
  computed: {
    ...mapGetters(['me']),
    getLayout(){
      return (this.$route.meta && this.$route.meta.layout) ? this.$route.meta.layout : 'Layout'
    },
    getUserId() {
      return this.me ? this.me.id : null
    }
  }
};
</script>
