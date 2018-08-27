<template>
  <transition :name="enterTransition" appear>
    <td class="cell animated"
         :class="classes"
         @click="primaryOrSecondaryAction"
         @contextmenu.prevent="secondaryAction">
    </td>
  </transition>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'Cell',
  props: ['x', 'y'],
  data () {
    return {
      enterTransition: null
    }
  },
  methods: {
    primaryOrSecondaryAction () {
      if (this.isSecondaryActionEnabled) {
        this.secondaryAction()
      } else {
        this.primaryAction()
      }
    },
    primaryAction () {
      if (this.isCompleted) return

      if (this.editMode) {
        this.toggleFilled()
      } else {
        this.toggleSelected()
      }
    },
    secondaryAction () {
      if (this.isCompleted) return

      if (!this.editMode) {
        this.toggleMark()
      }
    },
    toggleFilled () {
      this.cell.filled = !this.cell.filled
    },
    toggleSelected () {
      this.$store.commit('toggleCellSelected', { x: this.x, y: this.y })
    },
    toggleMark () {
      this.$store.commit('toggleCellMarked', { x: this.x, y: this.y })
    },
    randomBool () {
      return (Math.random() < 0.5)
    },
    checkIsComplete () {
      if (this.isCompleted) return true

      const isNowCompleted = this.cells.every((row) => {
        return row.every((cell) => {
          return cell.filled ? cell.selected : !cell.selected
        })
      })
      if (isNowCompleted) {
        this.$store.commit('setIsCompleted')
        this.$ga.event('SolvePixelPic', 'completed', null, this.id)
      }
    }

  },
  computed: {
    ...mapState([
      'id',
      'editMode',
      'isCompleted',
      'isSecondaryActionEnabled',
      'cells'
    ]),
    cell () {
      return this.$store.getters.cellAt(this.x, this.y)
    },
    selected () {
      return this.cell.selected
    },
    marked () {
      return this.cell.marked
    },
    filled () {
      return this.cell.filled
    },
    displayFilled () {
      return (this.filled && this.editMode)
    },
    classes () {
      return {
        filled: this.displayFilled,
        selected: this.selected,
        marked: this.marked && !this.isCompleted,
        bounceIn: this.displayFilled || this.selected,
        zoomIn: this.marked,
        'solved-empty': this.isCompleted
      }
    }
  },
  created () {
    const verticalModifier = this.randomBool() ? '-vertical' : ''
    const reverseModifier = this.randomBool() ? '-reverse' : ''
    this.enterTransition = 'slide-fade' + verticalModifier + reverseModifier
  },
  watch: {
    selected () {
      this.checkIsComplete()
    },
    marked () {
      this.checkIsComplete()
    }
  }
}
</script>

<style scoped>
  .cell {
    display: inline-block;
    height: 32px;
    width: 32px;
    background-color: #e8e8e8;
    cursor: pointer;
    -webkit-animation-duration: 1s;
    -moz-animation-duration: 1s;
  }

  .filled {
    background-color: #333;
  }

  @media only screen and (max-width: 446px) {
    .requires-cell-resize .cell {
      height: 22px;
      width: 22px;
    }
  }

  .solved-empty {
    background-color: #f8f8f8;
  }

  .marked {
    background-color: orange !important;
    height: 32px;
    width: 32px;
    -webkit-animation-duration: 0.5s;
    -moz-animation-duration: 0.5s;
  }

  .selected {
    background-color: #666;
  }

  .slide-fade-enter-active,
  .slide-fade-reverse-enter-active,
  .slide-fade-vertical-enter-active,
  .slide-fade-vertical-reverse-enter-active {
    transition: all .5s ease-out;
  }

  .slide-fade-enter {
    transform: translateX(48px);
    opacity: 0;
  }

  .slide-fade-reverse-enter {
    transform: translateX(-48px);
    opacity: 0;
  }

  .slide-fade-vertical-enter {
    transform: translateY(48px);
    opacity: 0;
  }

  .slide-fade-vertical-reverse-enter {
    transform: translateY(-48px);
    opacity: 0;
  }
</style>
