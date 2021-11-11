<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-row>
          <v-col>
            <v-col>
              <span>
                نوع الخدمة : {{ sellable_type }}
              </span>
            </v-col>
            <v-row>
              <v-col cols="6">
                <v-text-field
                  id="barcode"
                  v-model="barcode"
                  autofocus
                  :error="barcodeErrorFound"
                  clearable
                  prepend-icon="mdi-barcode"
                  label="باركود"
                  hint="قم بمسح الباركود في هذه الخانة"
                  @keyup="barcodeScan"
                />
              </v-col>
              <v-col cols="6">
                <v-text-field id="name" v-model="barcodeReturn.product_name" autofocus label="إسم المنتج" />
              </v-col>
            </v-row>
            <v-col>
              <v-text-field id="price" v-model="selling_price" prepend-icon="mdi-dollar-sign" label="سعر البيع" :disabled="price_disabled" />
            </v-col>
            <v-col>
              <v-text-field id="quantity" v-model="quantity" prepend-icon="mdi-basket" label="الكمية" :disabled="!price_disabled" />
            </v-col>
            <v-col>
              <v-btn block color="indigo" class=" lighten--2" dark @click="addDiscount = !addDiscount">
                <v-icon>mdi-sale</v-icon> إضافة خصم
              </v-btn>
            </v-col>
            <v-col>
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
                      :disabled="!price_disabled"
                    />
                  </v-col>
                </v-row>
              </v-expand-transition>
            </v-col>
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
      barcode: null,
      quantity: 1,
      addDiscount: false,
      selling_price: null,
      product_name: null,
      is_record: false,
      price_disabled: true,
      discount: 0,
      sellable_type: 'يجب مسح الباركود اولاً',
      discount_fixed: true,
      barcodeErrorFound: false,
      barcodeReturn: {}
    }
  },
  computed: {
    shiftId () {
      return this.$store.state.shift.id
    }
  },
  methods: {
    barcodeScan () {
      if (this.barcode == null) {
        this.barcodeReturn = {}
        this.price = null
        this.sellable_type = 'يجب مسح الباركود اولاً'
        this.price_disabled = true
        return
      }
      this.selling_price = 0
      this.addDiscount = false
      this.discount = 0
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
      const data = {
        barcode: this.barcode,
        quantity: this.quantity,
        selling_price: this.selling_price,
        invoice_id: this.invoiceId,
        discount_fixed: this.discount_fixed,
        discount: this.discount
      }
      this.$axios.post('pos/sales/add/item', data).then(() => {
        this.barcode = null
        this.barcodeScan()
        document.getElementById('barcode').focus()
        this.$emit('itemSubmited')
      })
    }
  }
}
</script>
