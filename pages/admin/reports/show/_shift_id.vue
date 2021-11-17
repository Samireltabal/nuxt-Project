<template>
  <v-layout>
    <v-container fluid>
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
      <v-row v-if="showPerHour">
        <v-col v-if="showPerHour" cols="6">
          <v-row>
            <v-col cols="12">
              <RenderDoughnutShift v-if="showPerHour" head="Sales Per Type" :keys="report.report.per_type.keys" :values="report.report.per_type.values" />
            </v-col>
            <v-col cols="12">
              <RenderLineShift v-if="showPerHour" head="Sales Per Hour" color="#2ecc71" :keys="report.report.per_hour.keys" :values="report.report.per_hour.values" />
            </v-col>
          </v-row>
        </v-col>
        <v-col v-if="showPerHour" cols="6">
          <v-simple-table v-if="showPerHour">
            <template v-slot:default>
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
  </v-layout>
</template>
<script>
import RenderLineShift from '../../../../components/Widgets/admin/RenderLineShift.vue'
import RenderDoughnutShift from '../../../../components/Widgets/admin/RenderDoughnutShift.vue'
export default {
  name: 'Report',
  components: {
    RenderLineShift,
    RenderDoughnutShift
  },
  layout: 'admin',
  data () {
    return {
      report: {},
      showPerHour: false
    }
  },
  async fetch () {
    this.showPerHour = false
    this.report = await this.$axios.$get(`/admin/reports/show/${this.shift_id}`)
    this.showPerHour = true
  },
  computed: {
    shift_id () {
      return this.$route.params.shift_id
    }
  },
  methods: {
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
          this.submit_generation_request(this.shift_id)
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
