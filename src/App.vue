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

          <b-nav-item v-if="scatter && !accountName" href @click="scatterConnect" class="icon-link">
            <icon name="plug"></icon>
            <span>Connect Scatter</span>
          </b-nav-item>

          <b-nav-item v-if="accountName" href @click="scatterDisconnect" class="icon-link">
            <icon name="sign-out-alt"></icon>
            <span>Disconnect {{ accountName }}</span>
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
      'accountName'
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
      const eosMainnet = { blockchain: 'EOS', chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906' }
      const requiredFields = { accounts: [eosMainnet] }

      await this.scatter.getIdentity(requiredFields).then((identity) => {
        console.log('Got identity: ' + identity.name)
        console.log(identity)
        const accountName = identity.accounts[0].name
        this.$store.commit('setAccountName', accountName)
      }).catch((error) => {
        console.log('Error getting identity: ' + error)
      })
    },
    async scatterDisconnect () {
      await this.scatter.forgetIdentity()
      this.$store.commit('setAccountName', null)
    }
  }
}
</script>

<style>
</style>
