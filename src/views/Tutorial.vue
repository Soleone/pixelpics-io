<template>
  <b-container tag="section" class="mt-3">
    <b-row align-h="center">
      <h2>How to play</h2>
    </b-row>
    <b-row>
      <b-col align-h="center" class="text-center mt-3">
        <b-alert show variant="success">
          <h6>{{ carouselTitle }}</h6>
          <div>{{ carouselSubTitle }}</div>
        </b-alert>
      </b-col>
    </b-row>
    <b-row align-h="center">
      <b-col cols="10" sm="8" md="6" lg="4" xl="4">
        <b-carousel class="tutorial-carousel"
                    controls
                    indicators
                    :background="background"
                    :interval="5000"
                    v-model="slide"
        >
          <b-carousel-slide img-blank>
            <b-img thumbnail src="/static/tutorial-screen1.png" />
          </b-carousel-slide>
          <b-carousel-slide img-blank>
            <b-img thumbnail src="/static/tutorial-screen2.png" />
          </b-carousel-slide>
          <b-carousel-slide img-blank>
            <b-img thumbnail src="/static/tutorial-screen3.png" />
          </b-carousel-slide>
          <b-carousel-slide img-blank>
            <b-img thumbnail src="/static/tutorial-screen4.png" />
          </b-carousel-slide>
          <b-carousel-slide img-blank>
            <b-img thumbnail src="/static/tutorial-screen5.png" />
          </b-carousel-slide>
          <b-carousel-slide img-blank>
            <b-btn :to="{name: 'boards', params: {id: 1 }}" v-ga="$ga.commands.tutorial.bind(this, 'start')">Start a new game</b-btn>
          </b-carousel-slide>
        </b-carousel>
      </b-col>
    </b-row>
    <b-row>
      <b-col align-h="center" class="text-center mt-3">
        <b-btn v-show="!isLastSlide " variant="danger" :to="{name: 'boards', params: {id: 1 }}" v-ga="$ga.commands.tutorial.bind(this, 'skip')">Skip tutorial</b-btn>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
const CAROUSEL_TITLES = [
  [
    'Uncover the secret picture.',
    'The numbers are hints on how many tiles need to be selected.'
  ],
  [
    'Select the correct tiles.',
    'Click on tiles to select them if you think they are correct.'
  ],
  [
    'Mark tiles you don\'t want to select.',
    'Once you ruled out that a tile needs to be selected you can mark it in a different color.'
  ],
  [
    'Focus on the connected tiles.',
    'The numbers represent sets of connected tiles with empty spaces in between.'
  ],
  [
    'To win select all correct tiles.',
    'Early on focus on the edges of the board and larger sets of numbers.'
  ],
  [
    'Learn strategies as you play.',
    'Once you get the hang of it you can even create your own puzzles for other people.'
  ]
]

export default {
  name: 'Tutorial',
  data () {
    return {
      slide: 0,
      sliding: null
    }
  },
  computed: {
    carouselTitle () {
      return CAROUSEL_TITLES[this.slide][0]
    },
    carouselSubTitle () {
      return CAROUSEL_TITLES[this.slide][1]
    },
    background () {
      return this.isLastSlide ? '#fefefe' : '#d4d4d4'
    },
    isLastSlide () {
      return this.slide === CAROUSEL_TITLES.length - 1
    }
  }
}
</script>

<style scoped>
</style>
