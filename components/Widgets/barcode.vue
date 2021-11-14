<template>
  <v-card
    flat
    :loading="isLoading"
    outlined
    tile
  >
    <v-card-title color="indigo">
      <v-row>
        <v-col cols="12">
          مسح الباركود
        </v-col>
        <v-col cols="12">
          <v-text-field
            v-model="barcode"
            label="مسح الباركود"
          />
        </v-col>
      </v-row>
    </v-card-title>
    <v-expand-transition mode="in-out">
      <v-card-text v-if="resultFound">
        <component :is="item.type" :item="item" />
      </v-card-text>
    </v-expand-transition>
    <div>
      <v-btn color="success" block class="rounded-0" @click="submitQuery">
        <v-icon>mdi-database-search</v-icon> استعلام
      </v-btn>
      <v-btn color="error" block class="rounded-0" @click="cancelQuery">
        <v-icon>mdi-database-refresh</v-icon> الغاء
      </v-btn>
    </div>
  </v-card>
</template>
<script>
import record from './barcode/record.vue'
import product from './barcode/product.vue'
export default {
  name: 'BarcodeScanner',
  components: {
    record,
    product
  },
  data () {
    return {
      barcode: null,
      resultFound: false,
      isLoading: false,
      errorFound: false,
      error: null,
      item: {}
    }
  },
  methods: {
    cancelQuery () {
      this.resultFound = false
      this.isLoading = false
      this.barcode = null
      this.item = {}
      this.errorFound = false
      this.error = null
    },
    submitQuery () {
      this.isLoading = true
      this.$axios.post('/pos/sales/barcode/query', { barcode: this.barcode }).then((response) => {
        this.item = response.data
        this.barcode = null
        this.isLoading = false
        this.resultFound = true
        this.errorFound = false
        this.error = null
      }).catch((err) => {
        this.errorFound = true
        this.isLoading = false
        this.error = err.response.data.message
      })
    }
  }
}
</script>
