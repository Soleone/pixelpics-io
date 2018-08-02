<template>
  <div class="hint" :class="wrapperClasses">
    <div v-for="(hint, index) in hints.slice().reverse()" :key="`hint-item-${index}`" class="hint-item" :class="hintClasses">
      {{ hint }}
    </div>
  </div>
</template>

<script>
import { hintsForCells } from '../hint_generator'

export default {
  name: 'HintSeries',
  props: [
    'isVertical',
    'cells'
  ],
  computed: {
    wrapperClasses () {
      return {
        'hint-column': this.isVertical,
        'hint-row': !this.isVertical,
        'mr-1': !this.isVertical,
        'hint-item-completed': this.isAllCompleted
      }
    },
    hintClasses () {
      return {
        'ml-1': !this.isVertical
      }
    },
    hints () {
      return hintsForCells(this.cells)
    },
    selectedCells () {
      return hintsForCells(this.cells, 'selected')
    },
    isAllCompleted () {
      if (this.hints[0] === 0) {
        const markedHints = hintsForCells(this.cells, 'marked')
        return (markedHints.length === 1) && (markedHints[0] === this.cells.length)
      } else {
        return JSON.stringify(this.hints) === JSON.stringify(this.selectedCells)
      }
    }
  }
}
</script>

<style scoped>
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

  @media only screen and (max-width: 446px) {
    .hint {
      padding:0;
    }
  }

  .hint-row {
    width: 64px;
    display: flex;
    flex-direction: row-reverse;
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

  .hint-item-completed {
    color: #dfdfdf;
  }
</style>
