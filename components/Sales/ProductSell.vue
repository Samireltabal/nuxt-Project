<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-row>
          <v-col>
            <v-row>
              <v-col cols="6">
                <v-row>
                  <v-col cols="12">
                    <v-autocomplete
                      id="barcode"
                      v-model="product_name"
                      :items="items"
                      :search-input.sync="search"
                      dense
                      hide-no-data
                      item-text="product_name"
                      autofocus
                      :error="barcodeErrorFound"
                      clearable
                      prepend-icon="mdi-basket-plus"
                      label="إسم المنتج"
                      hint="إبدأ بكتابة إسم المنتج"
                      return-object
                      filled
                      outlined
                      persistent-hint
                      solo
                    />
                  </v-col>
                  <v-col cols="12">
                    <v-text-field id="price" v-model="selling_price" prepend-icon="mdi-dollar-sign" label="سعر البيع" :disabled="price_disabled" />
                  </v-col>
                  <v-col cols="12">
                    <v-text-field id="name" v-model="Pname" autofocus label="إسم المنتج" disabled />
                  </v-col>
                  <v-col cols="12">
                    <v-text-field id="quantity" v-model="quantity" prepend-icon="mdi-basket" label="الكمية" :disabled="price_disabled" />
                  </v-col>
                  <v-col cols="12">
                    <v-btn block color="indigo" class=" lighten--2" dark @click="addDiscount = !addDiscount">
                      <v-icon>mdi-sale</v-icon> إضافة خصم
                    </v-btn>
                  </v-col>
                  <v-col cols="12">
                    <v-expand-transition>
                      <v-row v-if="addDiscount">
                        <v-col cols="3">
                          <v-checkbox v-model="discount_fixed" label="خصم ثابت" />
                        </v-col>
                        <v-col cols="9">
                          <v-text-field
                            v-model="discount"
                            prepend-icon="mdi-dollar"
                            label="الخصم"
                            persistent-hint
                            hint="إذا كام الخصم ثابت سيتم خصم هذا الرقم من السعر .. او تكون نسبة مئوية من السعر"
                            :disabled="price_disabled"
                          />
                        </v-col>
                      </v-row>
                    </v-expand-transition>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="6">
                <span v-if="product_name && typeof product_name === 'object'">
                  <v-list>
                    <v-list-item>
                      إسم المنتج : {{ product_name.product_name }}
                    </v-list-item>
                    <v-list-item>
                      سعر البيع : {{ product_name.original_price }}
                    </v-list-item>
                    <v-list-item>
                      الكمية المتاحه :
                      <v-chip v-for="(Squantity, stock) in product_name.stock" :key="stock + product_name.id" :color="Squantity > 0 ? 'indigo' : 'error'" dark class="mx-1">
                        {{ stock }} : {{ Squantity }}
                      </v-chip>
                    </v-list-item>
                    <v-list-item>
                      باركود : {{ product_name.barcode }}
                    </v-list-item>
                  </v-list>
                </span>
              </v-col>
            </v-row>
            <v-col>
              <v-btn block color="success" class="rounded-0 mt-2" @click="submitItem">
                إضافة
              </v-btn>
            </v-col>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  name: 'ProductSell',
  props: {
    invoiceId: {
      required: false,
      type: Number,
      default: null
    }
  },
  data () {
    return {
      isLoading: false,
      search: null,
      barcode: null,
      entries: [],
      Pname: null,
      quantity: 1,
      addDiscount: false,
      selling_price: null,
      product_name: null,
      is_record: false,
      price_disabled: true,
      discount: 0,
      sellable_type: 'إبدأ بالبحث عن المنتج',
      discount_fixed: true,
      barcodeErrorFound: false,
      barcodeReturn: {}
    }
  },
  computed: {
    shiftId () {
      return this.$store.state.shift.id
    },
    fields () {
      if (!this.device) { return [] }
      return Object.keys(this.phone).map((key) => {
        return {
          key,
          value: this.phone(key) || 'n/a'
        }
      })
    },
    items () {
      return this.entries.map((entry) => {
        const Description = entry.product_name
        return Object.assign({}, entry, { Description })
      })
    },
    itemForm () {
      return {
        barcode: this.product_name ? this.product_name.barcode : null,
        quantity: this.quantity,
        selling_price: this.selling_price,
        invoice_id: this.invoiceId,
        discount_fixed: this.discount_fixed,
        discount: this.discount
      }
    }
  },
  watch: {
    search (val) {
      // Items have already been loaded
      // if (this.items.length > 0) { return }

      // Items have already been requested
      if (this.isLoading) { return }

      this.isLoading = true

      // Lazily load input items
      this.$axios.post('pos/products/search', { term: val })
        .then((res) => {
          this.entries = res.data
        })
        .finally(() => (this.isLoading = false))
    },
    product_name (val) {
      if (val && typeof val === 'object') {
        this.newitem = false
        this.price_disabled = false
        this.selling_price = val.original_price
        this.Pname = val.product_name
      } else {
        this.price_disabled = true
        this.selling_price = null
        this.Pname = null
      }
    }
  },
  methods: {
    barcodeScan () {
      if (this.barcode == null) {
        this.barcodeReturn = {}
        this.price = null
        this.quantity = 1
        this.sellable_type = 'يجب مسح الباركود اولاً'
        this.price_disabled = true
        return
      }
      this.selling_price = 0
      this.addDiscount = false
      this.discount = 0
      this.quantity = 1
      const data = {
        barcode: this.barcode
      }
      this.$axios.post('/pos/sales/barcode/query', data).then((response) => {
        this.barcodeReturn = response.data
        if (!response.data.device) {
          this.selling_price = response.data.original_price
          this.sellable_type = 'بيع منتج'
          this.is_record = true
          document.getElementById('price').focus()
        } else {
          this.price_disabled = false
          this.price = null
          this.sellable_type = 'صيانة'
          this.is_record = false
          document.getElementById('quantity').focus()
        }
        this.barcodeErrorFound = false
      }).catch((err) => {
        this.barcodeErrorFound = true
        this.barcodeReturn = {}
        this.price = null
        this.sellable_type = 'يجب مسح الباركود اولاً'
        this.price_disabled = true
        this.barcodeError = err.response.data.message
      })
    },
    submitItem () {
      this.$axios.post('pos/sales/add/item', this.itemForm).then(() => {
        this.product_name = null
        document.getElementById('barcode').focus()
        this.$emit('itemSubmited')
      })
    }
  }
}
</script>
