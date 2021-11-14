<template>
  <v-row justify="center" align="center">
    <v-col>
      <barcode-scanner />
    </v-col>
    <v-col>
      Lorem ipsum dolor, sit amet consectetur adipisicing elit. Voluptatum atque neque sed, autem ut reiciendis aperiam magnam possimus veritatis magni culpa itaque fugit est fuga velit modi sapiente eos? Eos!
    </v-col>
    <v-col>
      large
    </v-col>
  </v-row>
</template>
<script>
import BarcodeScanner from '../components/Widgets/barcode.vue'
export default {
  components: {
    BarcodeScanner
  },
  data () {
    return {
      response: {}
    }
  },
  computed: {
    token () {
      return this.$auth.strategy.token.get()
    }
  },
  mounted () {
    this.ping()
  },
  methods: {
    ping () {
      this.$axios.get('ping').then((response) => {
        this.response = response.data
      })
    }
  }
}
</script>
