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
          <b-nav-item v-b-modal="'about-modal'">About</b-nav-item>
        </b-navbar-nav>

        <b-navbar-nav class="ml-auto">
          <b-nav-item-dropdown :text="networkName">
            <b-nav-item @click="setNetworkName('Mainnet')">Mainnet</b-nav-item>
            <b-nav-item @click="setNetworkName('Testnet')">Testnet</b-nav-item>
          </b-nav-item-dropdown>
          <b-nav-item v-if="!scatter" href="https://www.get-scatter.com" target="_blank" v-b-tooltip.hover title="Install or unlock Scatter to connect to the EOS blockchain.">
            Scatter supported
          </b-nav-item>

          <transition name="bounce" leave-active-class="bounceUp">
            <b-nav-item v-if="scatter && !accountName" href @click="scatterConnect">
              <icon name="plug"></icon>
              <span>Connect Scatter</span>
            </b-nav-item>
          </transition>

          <b-nav-item v-if="accountName" href @click="scatterDisconnect">
            <icon name="sign-out-alt"></icon>
            <span>Disconnect {{ accountName }}</span>
          </b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>

    <b-modal id="about-modal" title="Pixel Pics" :ok-only="true" ok-title="Thanks" ok-variant="secondary">
      Built by <a href="https://soleone.github.io" target="_blank">Sole One</a>.
      All code <a href="https://github.com/soleone/pixelpics-io" target="_blank">open source</a>.
      Powered by <a href="https://eos.io" target="_blank">EOS</a>.
    </b-modal>

    <router-view :key="$route.fullPath" />
  </div>
</template>

<script>
import Cell from './components/Cell.vue'
import Board from './components/Board.vue'
import BINARY_CELLS from './cell_data'
import { EOS_MAIN_NET, JUNGLE_NET } from './constants'
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'app',
  components: {
    Board,
    Cell
  },
  data () {
    return {
      networkName: 'Mainnet'
    }
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
    },
    network () {
      return this.networkName === 'Mainnet' ? EOS_MAIN_NET : JUNGLE_NET
    }
  },
  methods: {
    async scatterConnect () {
      this.scatter.suggestNetwork(this.network)
      const requiredFields = { accounts: [this.network] }

      await this.scatter.getIdentity(requiredFields).then((identity) => {
        console.log('Got identity: ' + identity.name)
        console.log(identity)
        if (identity.accounts.length) {
          const accountName = identity.accounts[0].name
          this.$store.commit('setAccountName', accountName)
        }
      }).catch((error) => {
        console.log('Error getting identity: ' + error)
      })
    },
    async scatterDisconnect () {
      await this.scatter.forgetIdentity()
      this.$store.commit('setAccountName', null)
    },
    setNetworkName (networkName) {
      this.networkName = networkName
    }
  }
}
</script>

<style>
</style>
