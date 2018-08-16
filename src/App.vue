<template>
  <div id="app" class="container">
    <b-navbar toggleable="md" variant="light">
      <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
      <b-navbar-brand class="mb-0 h1" href="/">
        Pixel Pics
      </b-navbar-brand>

      <b-collapse is-nav id="nav_collapse">
        <b-navbar-nav>
          <b-nav-item to="/new">Create</b-nav-item>
          <b-nav-item :to="{name: 'boards', params: {id: randomId }}">Random</b-nav-item>
          <b-nav-item :to="{name: 'boards', params: {id: previousId }}">Previous</b-nav-item>
          <b-nav-item :to="{name: 'boards', params: {id: nextId }}">Next</b-nav-item>
        </b-navbar-nav>

        <b-navbar-nav class="ml-auto">
          <b-nav-item v-if="!scatter" href="https://www.get-scatter.com" v-b-tooltip.hover title="Install or unlock Scatter to connect to the EOS blockchain.">
            Scatter supported
          </b-nav-item>

          <b-nav-item v-if="scatter && !scatterIdentity" href @click="scatterConnect" class="icon-link">
            <icon name="plug"></icon>
            <span>Connect Scatter</span>
          </b-nav-item>

          <b-nav-item v-if="scatterIdentity" href @click="scatterDisconnect" class="icon-link">
            <icon name="sign-out-alt"></icon>
            <span>Disconnect {{ scatterIdentity }}</span>
          </b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>

    <router-view :key="$route.fullPath" />
  </div>
</template>

<script>
import Cell from './components/Cell.vue'
import Board from './components/Board.vue'
import BINARY_CELLS from './cell_data'
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'app',
  components: {
    Board,
    Cell
  },
  computed: {
    ...mapState([
      'scatter',
      'scatterIdentity'
    ]),
    ...mapGetters([
      'nextId',
      'previousId'
    ]),
    randomId () {
      return Math.floor(Math.random() * Math.floor(Object.keys(BINARY_CELLS).length))
    }
  },
  methods: {
    async scatterConnect () {
      await this.scatter.getIdentity().then((identity) => {
        console.log('Got identity: ' + identity.name)
        console.log(identity)
        this.$store.commit('setScatterIdentity', identity.name)
      }).catch((error) => {
        console.log('Error getting identity: ' + error)
      })
    },
    async scatterDisconnect () {
      await this.scatter.forgetIdentity()
      this.$store.commit('setScatterIdentity', null)
    }
  }
}
</script>

<style>
</style>
