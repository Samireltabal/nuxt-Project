<template>
  <v-container>
    <v-row>
      <v-col>
        <h3>الورديات</h3>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-btn color="indigo" dark large @click="$fetch()">
          <v-icon>mdi-refresh</v-icon> Refresh
        </v-btn>
        <v-btn color="warning" dark large @click="generate_report">
          <v-icon>mdi-refresh</v-icon> إعادة توليد التقرير
        </v-btn>
      </v-col>
    </v-row>
    <v-row v-if="errorFound">
      <v-col>
        <p>{{ error }}</p>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="3">
        <v-list>
          <v-list-item>رقم الوردية : {{ shift.id }}</v-list-item>

          <v-list-item>الساعة الأن : {{ $luxon(shift.now) }}</v-list-item>

          <v-list-item>إيراد المبيعات : {{ shift.TotalProductsIncome ? shift.TotalProductsIncome.products : 'n/a' }} جنيه</v-list-item>

          <v-list-item>إيراد المبيعات الكلي : {{ shift.TotalProductsIncome ? shift.TotalProductsIncome.total : 'n/a' }} جنيه</v-list-item>

          <v-list-item>إيراد (iptv) : {{ shift.TotalIptvIncome }} جنيه</v-list-item>

          <v-list-item>إجمالي الطلبات : {{ shift.OrdersCount }} طلب</v-list-item>

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
      <v-col cols="3">
        <v-list>
          <v-list-item>وقت الفتح : {{ $luxon(shift.created_at) }}</v-list-item>
          <v-list-item>فتح بواسطة : {{ shift.user ? shift.user.name : '' }}</v-list-item>
          <v-list-item>إيراد الخدمات : {{ shift.TotalProductsIncome ? shift.TotalProductsIncome.services : 'n/a' }} جنيه</v-list-item>
          <v-list-item>إيراد الصيانة : {{ shift.TotalServiceIncome }} جنيه</v-list-item>
          <v-list-item>إجمالي الإيراد : {{ shift.TotalIncome }} جنيه</v-list-item>
          <v-list-item>الطلبات المغلقة : {{ shift.ClosedOrdersCount }} طلب</v-list-item>
        </v-list>
      </v-col>
      <v-col cols="6">
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
    <v-row v-if="showPerHour">
      <v-col cols="6">
        <v-row>
          <v-col cols="6">
            <RenderDoughnutShift v-if="showPerHour" head="Sales Per Type" :keys="report.report.per_type.keys" :values="report.report.per_type.values" />
          </v-col>
          <v-col cols="6">
            <RenderLineShift v-if="showPerHour" head="Sales Per Hour" color="#2ecc71" :keys="report.report.per_hour.keys" :values="report.report.per_hour.values" />
          </v-col>
        </v-row>
      </v-col>
      <v-col v-if="showPerHour" cols="6">
        <v-simple-table>
          <template #default>
            <thead>
              <tr>
                <th class="text-center">
                  نوع الخدمة
                </th>
                <th class="text-center">
                  إسم السجل
                </th>
                <th>متوسط السعر</th>
                <th>الكمية</th>
                <th>الإجمالي</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in report.report.table.items"
                :key="item.name"
              >
                <td>{{ item.type }}</td>
                <td v-html="item.name" />
                <td>{{ item.average_price }} جنيه</td>
                <td>{{ item.quantity }}</td>
                <td>{{ item.total }} جنيه</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3">
                  المبيعات
                </td>
                <td colspan="2">
                  {{ report.report.table.meta.income_splitted.sales.total }} جنيه
                </td>
              </tr>
              <tr>
                <td colspan="3">
                  الصيانة
                </td>
                <td colspan="2">
                  {{ report.report.table.meta.income_splitted.maintenance }} جنيه
                </td>
              </tr>
              <tr>
                <td colspan="3">
                  IPTV
                </td>
                <td colspan="2">
                  {{ report.report.table.meta.income_splitted.iptv }} جنيه
                </td>
              </tr>
              <tr>
                <td colspan="3">
                  بنادل
                </td>
                <td colspan="2">
                  {{ report.report.table.meta.income_splitted.sales.bundles }} جنيه
                </td>
              </tr>
              <tr>
                <td colspan="3">
                  الاجمالي
                </td>
                <td colspan="2">
                  {{ report.report.table.meta.total }} جنيه
                </td>
              </tr>
              <tr>
                <td colspan="3">
                  المصاريف
                </td>
                <td colspan="2">
                  {{ report.report.table.meta.expenses }} جنيه
                </td>
              </tr>
              <tr>
                <td colspan="3">
                  المشتريات
                </td>
                <td colspan="2">
                  {{ report.report.table.meta.purchase }} جنيه
                </td>
              </tr>
            </tfoot>
          </template>
        </v-simple-table>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import RenderLineShift from '../../../components/Widgets/admin/RenderLineShift.vue'
import RenderDoughnutShift from '../../../components/Widgets/admin/RenderDoughnutShift.vue'
export default {
  name: 'Shifts',
  components: {
    RenderLineShift,
    RenderDoughnutShift
  },
  layout: 'admin',
  data () {
    return {
      shift: {},
      showPerHour: false,
      errorFound: false,
      error: ''
    }
  },
  async fetch () {
    this.showPerHour = false
    this.shift = await this.$axios.$get('/admin/shift/full')
    this.showPerHour = true
  },
  computed: {
    user () {
      return this.$store.state.auth.user
    },
    report () {
      return this.shift
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
    },
    generate_report () {
      this.$swal.fire({
        title: 'هل انت متأكد من العملية ؟ ',
        text: 'سيتم توليد التقرير بمجرد الموافقة على العملية و لن تتمكن من التعديل مرة اخرى',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'توليد التقرير',
        cancelButtonText: 'الغاء الامر'
      }).then((result) => {
        if (result.isConfirmed) {
          this.submit_generation_request(this.shift.id)
        }
      })
    },
    submit_generation_request (id) {
      this.$axios.post('/admin/reports/generate', { shift_id: id }).then(() => {
        this.$swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'تمت إرسال طلب إعادة التوليد التوليد بنجاح',
          showConfirmButton: false,
          timer: 1500
        })
        this.$fetch()
      })
    }
  }
}
</script>
