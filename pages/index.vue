<template>
  <v-row justify="center" align="center">
    <v-col>
      <barcode-scanner />
    </v-col>
    <v-col>
      <iptv-query />
    </v-col>
    <v-col>
      <v-card
        flat
        outlined
        tile
      >
        <v-card-title>بيانات اليومية</v-card-title>
        <v-card-text>
          <v-list>
            <v-list-item>
              تاريخ اليومية : {{ $luxon($store.state.shift_data.created_at) }}
            </v-list-item>
            <v-list-item>
              تاريخ اليوم : {{ $luxon($store.state.shift_data.now) }}
            </v-list-item>
            <v-list-item>
              حالة اليومية :
              <v-chip class="mx-2" small :color="$store.state.shift_validity ? 'success' : 'error' ">
                {{ $store.state.shift_validity ? 'جيد' : 'برجاء مراجعة مدير النظام' }}
              </v-chip>
            </v-list-item>
            <v-list-item>
              إسم الموظف : {{ $store.$auth.state.user.name }}
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
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
