import Vue from 'vue'
import Vuex from 'vuex'
import { pixelMapToCells } from './pixel_pic'
import BINARY_CELLS from './cell_data'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    default: {
      cells: pixelMapToCells(Object.values(BINARY_CELLS)[1])
    },
    cells: [],
    editMode: true,
    id: null,
    isCompleted: false,
    isSecondaryActionEnabled: false
  },
  mutations: {
    toggleCellSelected (state, cellPosition) {
      const cell = this.getters.cellAt(cellPosition.x, cellPosition.y)
      cell.marked = false
      cell.selected = !cell.selected
    },
    toggleCellMarked (state, cellPosition) {
      const cell = this.getters.cellAt(cellPosition.x, cellPosition.y)
      cell.selected = false
      cell.marked = !cell.marked
    },
    toggleIsSecondaryActionEnabled (state) {
      state.isSecondaryActionEnabled = !state.isSecondaryActionEnabled
    },
    setIsCompleted (state) {
      state.isCompleted = true
    }
  },
  getters: {
    cellAt (state) {
      return (x, y) => {
        return state.cells[y][x]
      }
    },
    nextId (state) {
      if (state.id === null) return 1

      return (parseInt(state.id) % Object.keys(BINARY_CELLS).length) + 1
    },
    previousId (state) {
      if (state.id === null || state.id === 1) return 1

      return (parseInt(state.id) % Object.keys(BINARY_CELLS).length) - 1
    }
  }
})

export default store
