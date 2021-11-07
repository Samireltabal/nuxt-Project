<template>
  <v-container>
    <v-row>
      <v-col>
        <h3>{{ msg }}</h3>
        <v-list-group>
          <v-list-item>
            <v-btn color="success" fab x-small class="mx-1 my-1" disabled>
              <v-icon>mdi-cart-plus</v-icon>
            </v-btn>
            إضافة امر شراء جديد
          </v-list-item>
          <v-list-item>
            <v-btn color="success" fab x-small class="mx-1 my-1" disabled>
              <v-icon>mdi-receipt</v-icon>
            </v-btn>
            دخول لصفحة المورد
          </v-list-item>
          <v-list-item>
            <v-btn color="success" fab x-small class="mx-1 my-1" disabled>
              <v-icon>mdi-delete</v-icon>
            </v-btn>
            حذف حساب المورد بالكامل
          </v-list-item>
        </v-list-group>
      </v-col>
      <v-col>
        <v-list-group v-model="openForm">
          <template slot="activator">
            <v-btn color="success" dark>
              <v-icon class="mx-2">
                mdi-account-plus
              </v-icon> إضافة مورد
            </v-btn>
          </template>
          <template slot="appendIcon">
            &nbsp;
          </template>
          <template slot="prependIcon">
            &nbsp;
          </template>
          <v-list-item><v-text-field v-model="supplier_name" label="إسم المورد" /></v-list-item>
          <v-list-item><v-text-field v-model="supplier_phone" label="هاتف المورد" /></v-list-item>
          <v-list-item><v-text-field v-model="supplier_address" label="عنوان المورد" /></v-list-item>
          <v-list-item>
            <v-btn color="success" @click="submitSupplier">
              إضافة
            </v-btn>
          </v-list-item>
        </v-list-group>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-data-table dense :headers="headers" :items="suppliers" :loading="loading">
          <template #[`item.options`]="{ item }">
            <v-btn color="success" fab x-small class="mx-1 my-1" @click="createOrder(item.id)">
              <v-icon>mdi-cart-plus</v-icon>
            </v-btn>
            <v-btn
              color="indigo"
              fab
              x-small
              class="mx-1 my-1"
              dark
              @click="$router.push(`/orders?supplier=${item.id}`)"
            >
              <v-icon>mdi-receipt</v-icon>
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
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  name: 'Suppliers',
  layout: 'admin',
  data () {
    return {
      msg: 'قائمة الموردين',
      suppliers: [],
      openForm: false,
      supplier_name: null,
      supplier_phone: null,
      supplier_address: null,
      loading: true,
      headers: [
        { text: 'الاسم', value: 'supplier_name' },
        { text: 'التليفون', value: 'supplier_phone' },
        { text: 'العنوان', value: 'supplier_address' },
        { text: 'خصائص', value: 'options' },
        { text: 'الطلبات', value: 'OrdersCount' }
      ]
    }
  },
  async fetch () {
    this.loading = true
    this.suppliers = await this.$axios.$get('admin/suppliers/list')
    this.loading = false
  },
  computed: {
    form () {
      return {
        supplier_name: this.supplier_name,
        supplier_phone: this.supplier_phone,
        supplier_address: this.supplier_address
      }
    }
  },
  mounted () {
    this.$fetch()
  },
  methods: {
    submitSupplier () {
      this.$axios.post('admin/suppliers/create', this.form).then(() => {
        this.$toast.success('تمت الإضافة بنجاح')
        this.supplier_name = null
        this.supplier_phone = null
        this.supplier_address = null
        this.openForm = false
        this.$fetch()
      }).catch(() => {
        this.$toast.error('خطأ في الإضافة')
      })
    },
    createOrder (id) {
      this.$axios.post('/orders/create', { supplier_id: id }).then((response) => {
        this.$swal.fire(
          'response',
          response.data.supplier_id,
          'info'
        )
      }).catch((err) => {
        this.$swal.fire(
          'response',
          err.response.data,
          'error'
        )
      })
    }
  }
}
</script>
