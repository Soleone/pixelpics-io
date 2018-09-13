import Vue from 'vue'
import Vuex from 'vuex'
import { pixelMapToCells } from './pixel_pic'
import BINARY_CELLS from './cell_data'
import { EOS_MAIN_NET } from './constants'
import Eos from 'eosjs'

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
    isSecondaryActionEnabled: false,
    scatter: null,
    account: null,
    accountName: null,
    network: EOS_MAIN_NET
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
    setScatter (state, scatter) {
      state.scatter = scatter
    },
    setAccount (state, account) {
      state.account = account
      state.accountName = account && account.name
    },
    setNetwork (state, network) {
      state.network = network
    },
    setIsCompleted (state) {
      state.isCompleted = true
    },
    async upload (state, pixelpic) {
      const eos = state.scatter.eos(state.network, Eos, {})
      const eosOptions = { authorization: [state.accountName, state.account.authority].join('@') }
      await eos.contract('eospixelpics', eosOptions).then((pixelpics) => {
        pixelpics.create({
          owner: state.accountName,
          title: pixelpic.title,
          pixeldata: pixelpic.pixeldata
        }, eosOptions)
      })
    }
  },
  actions: {
    upload ({ commit }, data) {
      commit('upload', data)
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
