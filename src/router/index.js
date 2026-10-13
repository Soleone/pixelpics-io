import Vue from 'vue'
import Router from 'vue-router'
import Board from '../components/Board.vue'
import Tutorial from '../views/Tutorial.vue'
import { pixelMapToCells, createCells } from '../pixel_pic'
import BINARY_CELLS from '../cell_data'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Tutorial
    },
    {
      path: '/boards/:id',
      name: 'boards',
      component: Board,
      props (route) {
        const indexInt = parseInt(route.params.id) - 1
        const [title, binaryString] = Object.entries(BINARY_CELLS)[indexInt]
        const cells = pixelMapToCells(binaryString)
        return {
          params: {
            editMode: false,
            cells: cells,
            id: route.params.id,
            title: title
          }
        }
      }
    },
    {
      path: '/play/:map',
      name: 'play',
      component: Board,
      props (route) {
        return {
          params: {
            editMode: false,
            cells: pixelMapToCells(route.params.map),
            id: null,
            title: route.query.title || 'a shared picture'
          }
        }
      }
    },
    {
      path: '/new',
      name: 'new',
      component: Board,
      props () {
        return {
          params: {
            cells: createCells(10, 10),
            editMode: true
          }
        }
      }
    }
  ]
})
