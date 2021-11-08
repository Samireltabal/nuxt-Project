<template>
  <v-container>
    <v-row v-if="supplier_id">
      <v-col>
        <h4>عرض طلبات الشراء ل <v-chip>{{ supplier_data.supplier_name }}</v-chip></h4>
        <p>
          رقم التليفون : <v-chip>{{ supplier_data.supplier_phone }}</v-chip>
          <br>
          العنوان : <v-chip>{{ supplier_data.supplier_address }}</v-chip>
        </p>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-data-table dense :headers="headers" :items="list" :loading="loading">
          <template #[`item.created_at`]="{ item }">
            {{ $luxon(item.created_at) }}
          </template>
          <template #[`item.open`]="{ item }">
            <v-chip :color="item.open ? 'success' : 'error'">
              <v-icon :color="item.open ? 'white' : 'white'">
                {{ item.open ? 'mdi-check' : 'mdi-lock' }}
              </v-icon>{{ item.open ? 'مفتوح' : 'مغلق' }}
            </v-chip>
          </template>
          <template #[`item.options`]="{ item }">
            <v-btn color="success" fab x-small class="mx-1 my-1" @click="$router.push(`/admin/orders/show?order=${item.id}`)">
              <v-icon>mdi-eye</v-icon>
            </v-btn>
            <v-btn
              color="error"
              fab
              x-small
              class="mx-1 my-1"
              dark
              @click="alert(item.id)"
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>
            <v-btn
              color="warning"
              fab
              x-small
              class="mx-1 my-1"
              dark
              @click="closeOrder(item.id)"
            >
              <v-icon>mdi-lock</v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  name: 'PurchaseOrders',
  layout: 'admin',
  data () {
    return {
      msg: 'Purchase Orders',
      list: [],
      loading: true,
      supplier_data: {},
      headers: [
        { text: 'مسلسل', value: 'id' },
        { text: 'الاسم', value: 'supplier.supplier_name' },
        { text: 'تاريخ الفتح', value: 'created_at' },
        { text: 'الحالة', value: 'open' },
        { text: 'خصائص', value: 'options' }
        // {text: 'الطلبات', value: 'OrdersCount'}
      ]
    }
  },
  computed: {
    supplier_id () {
      return this.$route.query.supplier
    }
  },
  watch: {
    supplier_id () {
      this.fetchOrders()
      this.fetch_supplier_data()
    }
  },
  mounted () {
    this.fetchOrders()
    this.fetch_supplier_data()
  },
  methods: {
    fetchOrders () {
      let uri = 'orders/list'
      if (this.supplier_id) {
        uri += `?supplier_id=${this.supplier_id}`
      }
      this.$axios.get(uri).then((response) => {
        this.list = response.data
        this.loading = false
      })
    },
    fetch_supplier_data () {
      if (this.supplier_id) {
        this.$axios.get(`/admin/suppliers/show/${this.supplier_id}`).then((response) => {
          this.supplier_data = response.data
        })
      }
    },
    closeOrder (id) {
      const data = {
        order_id: id,
        force: false
      }
      this.$axios.post('/orders/close', data).then((response) => {
        this.$swal.fire(
          'تم الاغلاق بنجاح',
          response.data.message,
          'success'
        )
        this.fetchOrders()
      }).catch((err) => {
        this.$swal.fire({
          title: 'خطأ في الإغلاق',
          text: err.response.data.message,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'إغلاق و إدخال العناصر للمخزن',
          cancelButtonText: 'الغاء الامر'
        }).then((result) => {
          if (result.isConfirmed) {
            this.$axios.post('/orders/close', { order_id: id, force: true }).then((response) => {
              this.$swal.fire(
                'تم الاغلاق بنجاح',
                response.data.message,
                'success'
              )
              this.fetchOrders()
            })
          } else {
            this.$swal.fire(
              'تم الغاء الامر',
              '',
              'success'
            )
            this.fetchOrders()
          }
        })
      })
    }
  }
}
</script>
