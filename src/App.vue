<template>
  <v-app toolbar footer>
    <v-navigation-drawer
      persistent
      v-model="drawer"
      enable-resize-watcher
      clipped
    >
      <app-navigation></app-navigation>
    </v-navigation-drawer>
    <v-toolbar class="primary" dark fixed>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title>Book Trading Club</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-chip v-if="authenticated" class="accent white--text">
        <v-avatar>
          <v-icon>account_circle</v-icon>
        </v-avatar>
        {{ username }}
      </v-chip>
    </v-toolbar>
    <main>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </main>
    <v-footer class="primary">
      <span class="white--text">
        <span id="symbol">&#9997;</span> Made by Jakub Jabloński
      </span>
    </v-footer>
    <v-snackbar
      :timeout="snackbar.timeout"
      top
      :success="snackbar.context === 'success'"
      :error="snackbar.context === 'error'"
      v-model="snackbar.active"
      class="mt-2"
    >
      {{ snackbar.message }}
      <v-btn dark flat @click.native="$store.commit('deactivateSnackbar')">{{ snackbar.button }}</v-btn>
    </v-snackbar>    
  </v-app>
</template>

<script>
import Navigation from './components/Navigation.vue'

export default {
  data () {
    return {
      drawer: true
    }
  },
  computed: {
    username () {
      return this.$store.getters.username
    },
    authenticated () {
      return this.$store.getters.authenticated
    },
    snackbar () {
      return this.$store.getters.snackbar
    }
  },
  components: {
    appNavigation: Navigation
  },
  mounted () {
    this.$store.dispatch('fetchBooks')
  }
}
</script>

<style lang="stylus" scoped>
#symbol
  font-size: 20px
</style>
