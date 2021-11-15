<template>
  <v-row justify="center" align="center">
    <v-col>
      <barcode-scanner />
    </v-col>
    <v-col>
      <iptv-query />
    </v-col>
    <v-col>
      large
    </v-col>
  </v-row>
</template>
<script>
import BarcodeScanner from '../components/Widgets/barcode.vue'
import IptvQuery from '../components/Widgets/iptv/query.vue'
export default {
  components: {
    BarcodeScanner,
    IptvQuery
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
