<template>
  <b-container tag="section" class="mt-3">
    <b-row align-h="center">
      <h2>How to play</h2>
    </b-row>
    <b-row>
      <b-col align-h="center" class="text-center mt-3">
        <b-alert show variant="success">{{ carouselTitle }}</b-alert>
      </b-col>
    </b-row>
    <b-row align-h="center">
      <b-col cols="10" md="8" lg="6" xl="4">
        <b-carousel class="tutorial-carousel"
                    controls
                    indicators
                    :background="background"
                    interval="5000"
                    img-width="200"
                    img-height="220"
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
            <b-btn :to="{name: 'boards', params: {id: 1 }}">Start a new game</b-btn>
          </b-carousel-slide>
        </b-carousel>
      </b-col>
    </b-row>
    <b-row>
      <b-col align-h="center" class="text-center mt-3">
        <b-btn variant="danger" :to="{name: 'boards', params: {id: 1 }}">Skip tutorial</b-btn>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>

const CAROUSEL_TITLES = [
  'Solve the picture using the hints.',
  'Select the correct tiles.',
  'Mark tiles you don\'t want to select.',
  'Multiple numbers in a row represent tilesets with empty spaces in between.',
  'To win select all correct tiles.',
  'Learn strategies as you play.'
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
      return CAROUSEL_TITLES[this.slide]
    },
    background () {
      return this.slide === CAROUSEL_TITLES.length - 1 ? '#fefefe' : '#cccccc'
    }
  }
}
</script>

<style scoped>
</style>
