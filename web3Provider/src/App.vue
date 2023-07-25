<template>
  <v-app>
    <v-app-bar app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-app-bar-title class="d-none d-md-flex">Web3 Provider Template</v-app-bar-title>
      <v-spacer></v-spacer>
      <v-btn color="primary" large @click.stop="showDialog" v-if="!isLoggedIn">Login</v-btn>
      
      <v-btn v-if="isLoggedIn" @click.stop="showDialog" >{{ getUserName }}</v-btn>
      <WalletProvider :dialog="dialog" @updateDialog="dialog = $event" @loginEvent="isLoggedIn = $event"  />
      <v-btn 
        :prepend-icon="theme.global.name.value === 'light' ? 'mdi-weather-night' : 'mdi-weather-sunny'" @click="toggleTheme" />
    </v-app-bar>
    <v-navigation-drawer
        v-model="drawer"
        app>
        <NavMenu/>
    </v-navigation-drawer>
    <v-btn
      v-scroll="onScroll"
      v-show="fab"
      fab
      dark
      fixed
      bottom
      right
      color="primary"
      @click="toTop"
    >
      <v-icon>keyboard_arrow_up</v-icon>
    </v-btn>
    <v-main>
      <v-container class="py-8 px-6" fluid>
        <router-view/>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { useTheme } from 'vuetify'
import NavMenu from './components/NavMenu.vue'
import WalletProvider from './components/Provider.vue'

import {defineComponent} from 'vue'

export default defineComponent ({
  name: "App",
  components: {
    NavMenu,
    WalletProvider,
  },
  setup() {
      const theme = useTheme();
      return {
        theme, 
        toggleTheme: () => theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
      }
  },
  data() {
    return {
      drawer: false,
      group: null,
      dialog: false,
      isLoggedIn: false,
      fab: false,
      icons: [
        {icon: 'mdi-twitter', link: 'https://twitter.com/DStensvik'}
      ],
    }
  },
  methods: {
    showDialog()  {
      this.dialog = true;
    },
    CheckisLoggedInOnMount() {
      var token = sessionStorage.getItem("token");
      if (token === "" || token === null){
        
        this.isLoggedIn = false;
      }
      else{
        this.isLoggedIn = true;
      }
    },
    onScroll (e: any) {
      if (typeof window === 'undefined') return
      const top = window.scrollY ||   e.target.scrollTop || 0
      this.fab = top > 20
    },
    toTop () {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      })
    }
  },
  computed: {
    CheckisLoggedIn() {
      var address = sessionStorage.getItem("address");
      if (address === "" || address === null){
        console.log("Not logged in");
        return true;
      }
      else{
        console.log("Logged in");
        return false;
      }
    },
    getUserName() {
      var user = sessionStorage.getItem("address");

      return user;
    }
  },
  beforeMount() {
    this.CheckisLoggedInOnMount();
  }
})
</script>

<style>
#app {
  font-family: 'Roboto', sans-serif;;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
a { text-decoration: none; }

.walletconnect-modal__base {
  background-color: rgb(41, 41, 41) !important;
}

.walletconnect-modal__mobile__toggle {
  background-color: rgb(41, 41, 41) !important;
}

.walletconnect-modal__mobile__toggle_selector {
  background-color: rgb(114, 114, 114) !important;
}

.walletconnect-qrcode__text {
  color: aliceblue !important;
}

.walletconnect-search__input {
  @apply dark:bg-gray-600;
}
</style>

