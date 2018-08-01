import Vue from 'vue'
import Router from 'vue-router'
import Board from '../components/Board.vue'
import { binaryStringToCells, createCells } from '../cells'
import BINARY_CELLS from '../cell_data'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/boards/:id',
      name: 'boards',
      component: Board,
      props (route) {
        const indexInt = parseInt(route.params.id) - 1
        const [title, binaryString] = Object.entries(BINARY_CELLS)[indexInt]
        const cells = binaryStringToCells(binaryString)
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
