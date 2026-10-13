<template>
  <div id="app" class="container">
    <b-navbar toggleable="md" variant="light">
      <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
      <b-navbar-brand class="mb-0 h1" to="/">
        Pixel Pics
      </b-navbar-brand>

      <b-collapse is-nav id="nav_collapse">
        <b-navbar-nav>
          <b-nav-item to="/new">Create</b-nav-item>
          <b-nav-item :to="{name: 'boards', params: {id: randomDifferentId() }}">Random</b-nav-item>
          <b-nav-item :to="{name: 'boards', params: {id: nextId }}">Next</b-nav-item>
          <b-nav-item v-b-modal="'about-modal'">About</b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>

    <b-modal id="about-modal" title="Pixel Pics" :ok-only="true" ok-title="Thanks" ok-variant="secondary">
      <ul class="list-unstyled">
        <li>
          <a href="https://github.com/Soleone/pixelpics/issues" target="github">Submit feedback</a> if you see something.
          All code <a href="https://github.com/Soleone/pixelpics" target="github">open source</a>.
        </li>
        <li>
          Built by <a href="https://soleone.xyz" target="_blank">Sole One</a>.
        </li>
      </ul>
    </b-modal>

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
      'id'
    ]),
    ...mapGetters([
      'nextId'
    ])
  },
  methods: {
    randomDifferentId () {
      let random = this.randomId()
      return random === this.id ? this.randomDifferentId() : random
    },
    randomId () {
      const max = Math.floor(Object.keys(BINARY_CELLS).length)
      return Math.floor((Math.random() * max) + 1)
    }
  }
}
</script>

<style>
</style>
