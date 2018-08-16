import Vue from 'vue'
import App from './App.vue'
import BootstrapVue from 'bootstrap-vue'
import router from './router'
import store from './store'
import 'vue-awesome/icons'
import Icon from 'vue-awesome/components/Icon'
import ScatterJS from 'scatter-js/dist/scatter.esm'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'vue2-animate/dist/vue2-animate.min.css'

Vue.use(BootstrapVue)
Vue.component('icon', Icon)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

ScatterJS.scatter.connect('PixelPics').then((connected) => {
  if (!connected) {
    console.log('Failed connecting to Scatter.')
    return false
  }
  store.commit('setScatter', ScatterJS.scatter)
  window.scatter = null
  console.log('Connected to Scatter.')
}).catch((error) => {
  console.log(`Error connecting to Scatter: ${error}`)
})
