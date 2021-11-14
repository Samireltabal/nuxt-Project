<template>
  <v-container>
    <v-row>
      <v-col>
        <h3>الورديات</h3>
      </v-col>
    </v-row>
    <v-row v-if="errorFound">
      <v-col>
        <p>{{ error }}</p>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-list>
          <v-list-item>رقم الوردية : {{ shift.id }}</v-list-item>
          <v-list-item>وقت الفتح : {{ $luxon(shift.created_at) }}</v-list-item>
          <v-list-item>الساعة الأن : {{ $luxon(shift.now) }}</v-list-item>
          <v-list-item>فتح بواسطة : {{ shift.user ? shift.user.name : '' }}</v-list-item>
          <v-list-item>إيراد المبيعات : {{ shift.TotalProductsIncome ? shift.TotalProductsIncome.products : 'n/a' }} جنيه</v-list-item>
          <v-list-item>إيراد الخدمات : {{ shift.TotalProductsIncome ? shift.TotalProductsIncome.services : 'n/a' }} جنيه</v-list-item>
          <v-list-item>إيراد المبيعات الكلي : {{ shift.TotalProductsIncome ? shift.TotalProductsIncome.total : 'n/a' }} جنيه</v-list-item>
          <v-list-item>إيراد الصيانة : {{ shift.TotalServiceIncome }} جنيه</v-list-item>
          <v-list-item>إيراد (iptv) : {{ shift.TotalIptvIncome }} جنيه</v-list-item>
          <v-list-item>إجمالي الإيراد : {{ shift.TotalIncome }} جنيه</v-list-item>
          <v-list-item>إجمالي الطلبات : {{ shift.OrdersCount }} طلب</v-list-item>
          <v-list-item>الطلبات المغلقة : {{ shift.ClosedOrdersCount }} طلب</v-list-item>
          <v-list-item>إجمالي المشتريات : {{ shift.TotalPaid }} جنيه</v-list-item>
          <v-list-item>
            <v-list-group>
              <template #[`activator`]>
                إجمالي المصاريف : {{ shift.TotalExpenses }} جنيه
              </template>
              <v-list-item v-for="expense in shift.expenses" :key="expense.id">
                {{ expense.expense_name }} || {{ expense.value }} جنيه
              </v-list-item>
            </v-list-group>
          </v-list-item>
          <v-list-item />
        </v-list>
      </v-col>
      <v-col>
        <v-row>
          <v-col cols="12">
            <v-btn
              color="success"
              dark
              block
              @click="create_shift"
            >
              <v-icon>mdi-clock</v-icon> وردية جديدة
            </v-btn>
          </v-col>
          <v-col cols="6">
            <v-btn
              color="warning"
              dark
              block
              @click="get_current_shift"
            >
              <v-icon>mdi-refresh</v-icon> تحديث البيانات
            </v-btn>
          </v-col>
          <v-col cols="6">
            <v-btn
              color="indigo"
              dark
              block
            >
              <v-icon>mdi-printer</v-icon> طباعة التقرير
            </v-btn>
          </v-col>
          <v-col>
            <v-row>
              <v-col>إسم الموظف : </v-col>
              <v-col>{{ user.name }} </v-col>
            </v-row>
            <v-row>
              <v-col>الرتبة : </v-col>
              <v-col>{{ user.role }} </v-col>
            </v-row>
            <v-row>
              <v-col>رقم التليفون</v-col>
              <v-col>{{ user.phone }} </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  name: 'Shifts',
  layout: 'admin',
  data () {
    return {
      shift: {},
      errorFound: false,
      error: ''
    }
  },
  async fetch () {
    this.shift = await this.$axios.$get('/admin/shift/full')
  },
  computed: {
    user () {
      return this.$store.state.auth.user
    }
  },
  methods: {
    create_shift () {
      this.$swal.fire({
        title: 'هل انت متأكد ؟',
        text: 'لن تتمكن من فتح الوردية السابقة مرة اخرى',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'نعم افتح وردية جديدة',
        cancelButtonText: 'الغاء الامر'
      }).then((result) => {
        if (result.isConfirmed) {
          this.$axios.post('admin/shift', []).then(() => {
            this.$store.dispatch('notify', 'تم الإضافة بنجاح سيتم تحويلك في 3 ثواني')
            setTimeout(() => {
              location.reload()
            }, 3000)
          })
        } else {
          this.$swal.fire({
            title: 'تم الالغاء',
            text: 'تم الغاء الامر',
            icon: 'warning'
          })
        }
      })
    },
    get_current_shift () {
      this.$store.dispatch('Loading', true)
      this.$axios.get('/admin/shift/full').then((response) => {
        this.errorFound = false
        this.error = ''
        this.shift = response.data
        this.$store.dispatch('Loading', false)
      }).catch((err) => {
        this.errorFound = true
        this.error = err.response.data
        this.$store.dispatch('Loading', false)
      })
    }
  }
}
</script>
