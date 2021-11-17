<template>
  <v-layout>
    <v-container fluid>
      <v-row v-if="showPerHour">
        <pre>
          {{ report.report.grouped_data }}
        </pre>
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
        <v-col>
          <RenderLineShift v-if="showPerHour" head="Sales Per Hour" color="#2ecc71" :keys="report.report.per_hour.keys" :values="report.report.per_hour.values" />
        </v-col>
        <v-col>
          <RenderDoughnutShift v-if="showPerHour" head="Sales Per Type" :keys="report.report.per_type.keys" :values="report.report.per_type.values" />
        </v-col>
        <v-col>
          <v-list v-if="showPerHour">
            <v-list-item v-for="(item, key) in report.report.main_sales_items" :key="key">
              <v-card>
                <v-card-title>
                  {{ key }}
                </v-card-title>
                <v-card-text>
                  <v-list>
                    <v-list-item v-for="(value, order) in item" :key="order">
                      <v-card>
                        <v-card-title>
                          {{ order }}
                        </v-card-title>
                        <v-card-text>
                          <v-list>
                            <v-list-item v-for="single in value" :key="single.id">
                              {{ single.invoicable }} | {{ single.total }} | {{ single.quantity }}
                            </v-list-item>
                          </v-list>
                        </v-card-text>
                      </v-card>
                    </v-list-item>
                  </v-list>
                </v-card-text>
              </v-card>
            </v-list-item>
          </v-list>
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
