<template>
  <div class="board-wrapper animated" :class="{'fadeLeft': isCompleted}">

    <copy-button v-if="editMode" title="Board Code:" :value="cellsToBinaryString" class="mt-3">
    </copy-button>

    <table class="board" :class="{'requires-cell-resize': requiresCellResize}">
      <tr class="hint-header row">
        <td class="hint-header-spacer">
          <div class="hint hint-row">
            <!-- empty placeholder -->
          </div>
        </td>
          <td v-for="(_, y) in cells[0]" :key="`hint-col-${y}`">
            <div class="hint hint-column">
              <div v-for="(hint, index) in columnHints(y).reverse()" :key="`hint-item-${index}`" class="hint-item">
                {{ hint }}
              </div>
            </div>
          </td>
      </tr>

      <tr v-for="(row, y) in cells" class="row" :key="`row-${y}`">
        <td>
          <div class="hint hint-row">
            {{ hints(y) }}
          </div>
        </td>

        <cell v-for="(cell, x) in row" :key="cell.id" :x="x" :y="y">
        </cell>
      </tr>
    </table>

    <template v-if="!editMode">
      <b-form-group class="mt-3">
        <b-form-radio-group id="toggle-secondary-action-enabled"
        buttons
        button-variant="outline-secondary"
        v-bind:checked="isSecondaryActionEnabled"
        @change="toggleIsSecondaryActionEnabled"
        :options="secondaryActionEnabledButtons" />
      </b-form-group>

      <h4 class="pixture-title container bg-light text-secondary text-left p-3 mt-3">
        <div class="row">
          <b-badge pill variant="secondary">
            {{ formattedId }}
          </b-badge>
          <span class="ml-2">{{ title }}</span>
        </div>
      </h4>

      <transition name="bounce">
        <b-alert class="mt-3" variant="success" show v-if="isCompleted && !editMode">
          You got it! Try the
          <router-link :to="{name: 'boards', params: { id: nextId }}">next one.</router-link>
        </b-alert>
      </transition>
    </template>
  </div>
</template>


<script>
import Cell from './Cell.vue';
import CopyButton from './CopyButton.vue';
import { cellsToBinaryString } from '../cells';
import { hintsForCells } from '../hint_generator';
import { mapState, mapGetters } from 'vuex';

const REQUIRES_RESIZE_THRESHOLD = 7;

export default {
  name: 'Board',
  props: ['params'],
  data() {
    return {
      secondaryActionEnabledButtons: [
        { text: 'Select', value: false },
        { text: 'Mark', value: true },
      ]
    };
  },
  methods: {
    cellKey(x, y) {
      return x + "-" + y;
    },
    hints(index) {
      let row = this.cells[index];
      return hintsForCells(row).join(' ');
    },
    columnHints(x) {
      let column = this.transposedCells[x];
      return hintsForCells(column);
    },
    toggleIsSecondaryActionEnabled() {
      this.$store.commit('toggleIsSecondaryActionEnabled');
    },
  },
  computed: {
    ...mapState([
      'id',
      'editMode',
      'cells',
      'title',
      'isCompleted',
      'isSecondaryActionEnabled'
    ]),
    ...mapGetters([
      'nextId'
    ]),
    cellsToBinaryString() {
      return cellsToBinaryString(this.cells)
    },
    transposedCells() {
      return this.cells[0].map( (column, columnIndex) => {
        return this.cells.map(row => row[columnIndex]);
      });
    },
    requiresCellResize() {
      return this.cells[0].length > REQUIRES_RESIZE_THRESHOLD;
    },
    formattedId() {
      return this.id.toString().padStart(3, "0");
    }
  },
  created() {
    this.$store.state.cells = this.params.cells || this.$store.state.default.cells;
    this.$store.state.editMode = this.params.editMode || false;
    this.$store.state.id = this.params.id;
    this.$store.state.title = this.params.title;
    this.$store.state.isCompleted = false;
  },
  components: {
    Cell,
    CopyButton,
  }
}
</script>


<style scoped>
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

  .hint {
    display: inline-block;
    margin: 2px;
    padding: 4px;
    text-align: right;
    font-weight: bold;
    font-size: 12px;
    color: #666666;
    background-color: #ffffff;
    cursor: default;
  }

  .hint-row {
    width: 64px;
    padding:0;
    margin: 0 8px 0 0;
  }

  .hint-column {
    height: 96px;
    width: 32px;
    padding-right: 8px;
    display: flex;
    flex-direction: column-reverse;
  }

  .hint-item {
    align-self: flex-end;
  }

  .hint-header td {
    width: 32px;
  }

  .hint-header .hint-header-spacer {
    width: 64px;
  }

  @media only screen and (max-width: 440px) {
    .hint-header .hint-header-spacer {
      width: 64px !important;
    }

    .requires-cell-resize .hint-header td {
      width: 23px;
    }
  }
</style>
