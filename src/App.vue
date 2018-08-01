<template>
  <div id="app" class="container">
    <b-navbar toggleable="md" variant="light">
      <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
      <b-navbar-brand class="mb-0 h1" href="#">Pixel Pics</b-navbar-brand>

      <b-collapse is-nav id="nav_collapse">
        <b-navbar-nav>
          <b-nav-item to="/new">Create</b-nav-item>
          <b-nav-item :to="{name: 'boards', params: {id: randomId }}">Random</b-nav-item>
          <b-nav-item :to="{name: 'boards', params: {id: previousId }}">Previous</b-nav-item>
          <b-nav-item :to="{name: 'boards', params: {id: nextId }}">Next</b-nav-item>
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
import { mapGetters } from 'vuex'

export default {
  name: 'app',
  components: {
    Board,
    Cell
  },
  computed: {
    ...mapGetters([
      'nextId',
      'previousId'
    ]),
    randomId () {
      return Math.floor(Math.random() * Math.floor(Object.keys(BINARY_CELLS).length))
    }
  }
}
</script>

<style>
  @import 'bootstrap/dist/css/bootstrap.css';
  @import 'bootstrap-vue/dist/bootstrap-vue.css';
  @import 'vue2-animate/dist/vue2-animate.min.css';
</style>
