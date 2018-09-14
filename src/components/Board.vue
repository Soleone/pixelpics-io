<template>
  <section class="board-wrapper animated" :class="{'fadeLeft': isCompleted}">

    <!-- Edit controls -->
    <b-container v-if="editMode" class="mt-3">
      <b-form>
        <b-row>
          <b-col cols="6" lg="3" order="1" order-lg="1">
            <b-form-group description="Name of your picture, up to 12 characters long">
              <b-form-input v-model="eosTitle"
                            type="text"
                            maxlength="12"
                            size="lg"
                            placeholder="TITLE"
                            v-ga.keydown="$ga.commands.createPixelPic.bind(this, 'changeTitle')">
              </b-form-input>
            </b-form-group>
          </b-col>

          <b-col cols="6" lg="3" order="2" order-lg="4">
            <b-button id="save-button" @click="upload" variant="primary" size="lg">
              Save to EOS
            </b-button>
          </b-col>

          <b-col cols="6" lg="3" order="3" order-lg="2">
            <b-form-group :label="rowSizeTitle">
              <b-form-input type="range" min="3" max="10" v-model="rowSize" v-ga="$ga.commands.createPixelPic.bind(this, 'changeRowSize')"></b-form-input>
            </b-form-group>
          </b-col>

          <b-col cols="6" lg="3" order="4" order-lg="3">
            <b-form-group :label="columnSizeTitle">
              <b-form-input type="range" min="3" max="10" v-model="columnSize" v-ga="$ga.commands.createPixelPic.bind(this, 'changeColumnSize')"></b-form-input>
            </b-form-group>
          </b-col>
        </b-row>
      </b-form>
    </b-container>

    <!-- Board -->
    <table class="board" :class="{'requires-cell-resize': requiresCellResize}">
      <tr class="hint-header row">
        <td class="hint-header-spacer">
          <div class="hint hint-row">
            <!-- empty placeholder -->
          </div>
        </td>
        <td v-for="(_, y) in rows[0]" :key="`hint-col-${y}`">
          <hint-series isVertical="true" :cells="columns[y]"/>
        </td>
      </tr>

      <tr v-for="(row, y) in rows" class="row" :key="`row-${y}`">
        <td>
          <hint-series :isVertical="false" :cells="row"/>
        </td>

        <cell v-for="(cell, x) in row" :key="cell.id" :x="x" :y="y">
        </cell>
      </tr>
    </table>

    <!-- Game controls -->
    <template v-if="!editMode">
      <b-form-group class="mt-3">
        <b-form-radio-group id="toggle-secondary-action-enabled"
        buttons
        button-variant="outline-secondary"
        size="sm"
        v-bind:checked="isSecondaryActionEnabled"
        @change="toggleIsSecondaryActionEnabled"
        :options="secondaryActionEnabledButtons"
        v-ga="$ga.commands.solvePixelPic.bind(this, 'toggleIsSecondaryActionEnabled', this.id)" />
      </b-form-group>

      <h4 class="pixture-title container bg-light text-secondary text-left p-3 mt-3">
        <div class="row">
          <b-badge pill variant="secondary">
            {{ formattedId }}
          </b-badge>
          <span class="ml-2 text-uppercase font-weight-light">{{ title }}</span>
        </div>
      </h4>

      <transition name="bounce">
        <b-alert class="mt-3" variant="success" show v-if="isCompleted && !editMode">
          You got it! Try the
          <router-link :to="{name: 'boards', params: { id: nextId }}" v-ga="$ga.commands.solvePixelPic.bind(this, 'completedNext', this.id)" >
            next one
          </router-link>
          .
        </b-alert>
      </transition>
    </template>
  </section>
</template>

<script>
import Cell from './Cell.vue'
import HintSeries from './HintSeries.vue'
import CopyButton from './CopyButton.vue'
import { resizeCells, cellsToBigNumber } from '../pixel_pic'
import { hintsForCells } from '../hint_generator'
import { mapState, mapGetters, mapMutations } from 'vuex'

const REQUIRES_RESIZE_THRESHOLD = 7

export default {
  name: 'Board',
  props: ['params'],
  data () {
    return {
      secondaryActionEnabledButtons: [
        { text: 'Select', value: false },
        { text: 'Mark', value: true }
      ],
      rowSize: 6,
      columnSize: 6,
      title: null
    }
  },
  computed: {
    ...mapState([
      'id',
      'editMode',
      'cells',
      'isCompleted',
      'isSecondaryActionEnabled'
    ]),
    ...mapGetters([
      'nextId'
    ]),
    eosTitle: {
      get () {
        return this.title
      },
      set (newTitle) {
        newTitle = newTitle.toUpperCase().replace(/\s/, '.').replace(/[^A-Z.1-5]/, '')
        this.title = newTitle
      }
    },
    rows () {
      return this.cells
    },
    columns () {
      return this.rows[0].map((column, columnIndex) => {
        return this.rows.map(row => row[columnIndex])
      })
    },
    requiresCellResize () {
      return this.rows[0].length > REQUIRES_RESIZE_THRESHOLD
    },
    formattedId () {
      return this.id.toString().padStart(3, '0')
    },
    rowSizeTitle () {
      return `Rows: ${this.rowSize}`
    },
    columnSizeTitle () {
      return `Columns: ${this.columnSize}`
    }
  },
  methods: {
    ...mapMutations([
      'toggleIsSecondaryActionEnabled'
    ]),
    cellKey (x, y) {
      return x + '-' + y
    },
    rowHints (y) {
      let row = this.rows[y]
      return hintsForCells(row)
    },
    columnHints (x) {
      let column = this.columns[x]
      return hintsForCells(column)
    },
    resetBoard () {
      this.$store.state.cells = resizeCells(this.$store.state.cells, this.rowSize, this.columnSize)
    },
    upload () {
      const pixelpic = {
        title: this.eosTitle.toString().toLowerCase(),
        pixeldata: cellsToBigNumber(this.cells)
      }
      this.$store.dispatch('upload', pixelpic).then((result) => {
        console.log('Success')
      }).catch((error) => {
        console.log(`Error: ${error}`)
      })
    }
  },
  watch: {
    rowSize () {
      this.resetBoard()
    },
    columnSize () {
      this.resetBoard()
    }
  },
  created () {
    this.$store.state.cells = this.params.cells || this.$store.state.default.cells
    this.rowSize = this.$store.state.cells.length
    this.columnSize = this.$store.state.cells[0].length
    this.$store.state.editMode = this.params.editMode || false
    this.$store.state.id = this.params.id
    this.title = this.params.title
    this.$store.state.isCompleted = false
  },
  components: {
    Cell,
    CopyButton,
    HintSeries
  }
}
</script>

<style scoped>
  .board-wrapper {
    margin-bottom: 60px;
  }

  .board {
    padding:0;
    margin:0;
    border-collapse: inherit;
    border-spacing: 0px;
  }

  .board tr {
    padding:0;
    margin:0;
  }

  .board td {
    padding:0;
    margin:1px;
  }

  .cell:nth-child(6) {
    margin-right: 3px;
  }

  .row:nth-child(6) {
    margin-bottom: 3px;
  }

  .row {
    padding:0;
    margin:0;
  }

  .cell-row {
    height: 32px;
  }

  .hint-header .hint-header-spacer {
    width: 64px;
  }

  .hint-header td {
    width: 32px;
  }

  @media only screen and (max-width: 446px) {
    .hint-header .hint-header-spacer {
      width: 64px !important;
    }

    .requires-cell-resize .hint-header td {
      width: 22px;
    }
  }
</style>
