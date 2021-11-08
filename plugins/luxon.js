import Vue from 'vue'
import VueLuxon from 'vue-luxon'

Vue.use(VueLuxon, {
  input: {
    zone: 'EET',
    format: 'iso'
  },
  output: 'short'
})
