<template>
  <v-card :dark="this.$vuetify.theme.dark">
    <v-app id="inspire" :style="{ background: $vuetify.theme.themes[theme].background, height: '64px' }">
      <v-navigation-drawer app v-model="drawer" disable-route-watcher temporary clipped fixed>
        <sidebar-menu :nav="menu" v-on:closeDrawer="drawer = false"></sidebar-menu>
      </v-navigation-drawer>

      <v-app-bar app color="primary" :clipped-left="clipped">
        <v-app-bar-nav-icon class="onPrimary--text" @click="drawer = !drawer" />
        <slot name="toolbar-left"></slot>
        <v-spacer></v-spacer>
        <slot name="toolbar-right"></slot>
      </v-app-bar>
    </v-app>
    <slot></slot>

    <Footer></Footer>
  </v-card>
</template>

<script>
import SidebarMenu from './SidebarMenu'
import Footer from './Footer'


export default {
  components: { SidebarMenu, Footer },
  name: "TerminalLayout",
  props: {
    menu: { type: Array, default: null },
  },
  data: () => ({
    drawer: false,
    clipped: true,
  }
  ),
  computed: {
    theme() {
      return (this.$vuetify.theme.dark) ? 'dark' : 'light'
    }
  }
}
</script>

<style scoped></style>
