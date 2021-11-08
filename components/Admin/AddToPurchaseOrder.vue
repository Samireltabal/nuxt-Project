<template>
  <v-dialog
    v-model="dialog"
    max-width="600"
  >
    <template #activator="{ on, attrs }">
      <v-btn
        color="error"
        dark
        x-small
        class="mb-5 mt-5 mx-1"
        v-bind="attrs"
        v-on="on"
      >
        <v-icon>mdi-store-plus</v-icon> اضف الى طلبات الشراء
      </v-btn>
    </template>
    <v-card>
      <v-toolbar
        color="indigo"
        dark
      >
        طلب شراء
      </v-toolbar>
      <v-card-text>
        <v-chip
          v-for="order in openOrders"
          :key="order.id"
          class="d-block mx-2 my-2 px-2 py-2"
          :color="selectedOrderId == order.id ? 'success' : 'indigo'"
          dark
          @click="selectedOrderId = order.id"
        >
          {{ order.supplier.supplier_name }} - {{ $luxon(order.created_at) }}
        </v-chip>
      </v-card-text>
      <v-btn color="success" block class="rounded-0" :disabled="!selectedOrderId" @click="addItem">
        <v-icon>mdi-plus</v-icon> إضافة
      </v-btn>
      <v-btn color="error" block class="rounded-0" @click="cancelAddition">
        <v-icon>mdi-cancel</v-icon> إلغاء
      </v-btn>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  name: 'AddToPurchaseOrder',
  props: {
    partId: {
      required: true,
      type: Number
    },
    isPart: {
      type: Boolean,
      default: false
    },
    openOrders: {
      required: true,
      type: [Array, Object]
    }
  },
  data () {
    return {
      dialog: false,
      selectedOrderId: null
    }
  },
  methods: {
    addItem () {
      const data = {
        item_id: this.partId,
        order_id: this.selectedOrderId,
        is_part: this.isPart
      }
      this.$axios.post('/orders/item/add', data).then((response) => {
        if (this.is_part) {
          this.$store.dispatch('notify', `تم إضافة ${response.data.part_name} للطلب`)
        } else {
          this.$store.dispatch('notify', `تم إضافة ${response.data.product_name} للطلب`)
        }
      })
    },
    cancelAddition () {
      this.selectedOrderId = null
      this.dialog = false
    }
  }
}
</script>
