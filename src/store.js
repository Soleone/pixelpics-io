import Vue from 'vue'
import Vuex from 'vuex'
import { pixelMapToCells } from './pixel_pic'
import BINARY_CELLS from './cell_data'
import { EOS_MAIN_NET, ACCOUNT_NAME } from './constants'
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
    network: EOS_MAIN_NET,
    status: {
      info: null,
      error: null
    }
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
    },
    setNetwork (state, network) {
      state.network = network
    },
    setIsCompleted (state) {
      state.isCompleted = true
    },
    async upload (state, pixelpic) {
      state.status.info = null
      state.status.error = null
      const eos = state.scatter.eos(state.network, Eos, {})
      const eosOptions = { authorization: [state.account.name, state.account.authority].join('@') }
      state.status.info = 'Preparing smart contract interaction'
      await eos.contract(ACCOUNT_NAME, eosOptions).then((pixelpics) => {
        state.status.info = 'Received remote smart contract information'
        pixelpics.create({
          owner: state.account.name,
          title: pixelpic.title,
          pixeldata: pixelpic.pixeldata
        }, eosOptions).then((trx) => {
          state.status.info = `Successfully uploaded pixelpic. Transaction ID: ${trx.transaction_id}`
        }).catch((error) => {
          state.status.info = null
          state.status.error = `Error: ${error.message || error}`
        })
        state.status.info = 'Sending to Scatter'
      }).catch((error) => {
        state.status.info = null
        state.status.error = `Error: ${error.message || error}`
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
