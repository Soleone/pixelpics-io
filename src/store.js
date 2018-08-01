import Vue from 'vue'
import Vuex from 'vuex'
import { binaryStringToCells } from './cells'
import BINARY_CELLS from './cell_data'

Vue.use(Vuex)


const store = new Vuex.Store({
  state: {
    default: {
      cells: binaryStringToCells(Object.values(BINARY_CELLS)[1]),
    },
    cells: [],
    editMode: true,
    id: null,
    title: null,
    isCompleted: false,
    isSecondaryActionEnabled: false,
    //lastAction: null,

  },
  mutations: {
    toggleCellSelected(state, cellPosition) {
      const cell = this.getters.cellAt(cellPosition.x, cellPosition.y);
      cell.marked = false;
      cell.selected = !cell.selected;
      this.checkIsComplete(state);
    },
    toggleCellMarked(state, cellPosition) {
      const cell = this.getters.cellAt(cellPosition.x, cellPosition.y);
      cell.selected = false;
      cell.marked = !cell.marked;
    },
    toggleIsSecondaryActionEnabled(state) {
      state.isSecondaryActionEnabled = !state.isSecondaryActionEnabled;
    }
  },
  getters: {
    cellAt(state) {
      return (x, y) => {
        return state.cells[y][x];
      }
    },
    nextId(state) {
      if (state.id == null) return 1;

      return (parseInt(state.id) % Object.keys(BINARY_CELLS).length) + 1;
    },
    previousId(state) {
      if (state.id == null) return 1;

      return (parseInt(state.id) % Object.keys(BINARY_CELLS).length) - 1;
    },
  },
})

store.checkIsComplete = (state) => {
  const isCompleted = state.cells.every( (row) => {
    return row.every( (cell) => {
      return cell.filled ? cell.selected : !cell.selected;
    });
  });
  if (isCompleted) {
    state.isCompleted = true;
  }
}

export default store;
