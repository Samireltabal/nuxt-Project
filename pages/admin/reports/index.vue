<template>
  <v-layout>
    <v-container fluid>
      <v-row>
        <v-col>
          <h3>ورديات بدون تقارير مولدة</h3>
          <v-list>
            <v-list-item v-for="shift in ungenerated_reports" :key="shift.id">
              <v-chip
                class="ma-2"
                :color="shift.active ? 'error' : 'indigo'"
                :disabled="shift.active"
                label
                dark
                @click="generate_report(shift.id)"
              >
                <v-icon left>
                  mdi-account-circle-outline
                </v-icon>
                رقم : {{ shift.id }} || بتاريخ : {{ $luxon(shift.created_at) }}
              </v-chip>
            </v-list-item>
          </v-list>
        </v-col>
        <v-col>
          <h3>ورديات مغلقة</h3>
          <v-list>
            <v-list-item v-for="shift in generated_reports" :key="shift.id">
              <v-chip
                class="ma-2"
                :color="shift.active ? 'error' : 'indigo'"
                :disabled="shift.active"
                label
                dark
                @click="view_report(shift.id)"
              >
                <v-icon left>
                  mdi-eye
                </v-icon>
                رقم : {{ shift.id }} || بتاريخ : {{ $luxon(shift.created_at) }}
              </v-chip>
            </v-list-item>
          </v-list>
        </v-col>
      </v-row>
    </v-container>
  </v-layout>
</template>
<script>
export default {
  name: 'Reports',
  layout: 'admin',
  data () {
    return {
      ungenerated_reports: {},
      generated_reports: {}
    }
  },
  async fetch () {
    this.ungenerated_reports = await this.$axios.$get('/admin/reports/notclosedshifts')
    this.generated_reports = await this.$axios.$get('/admin/reports/closedshifts')
  },
  methods: {
    generate_report (id) {
      this.$swal.fire({
        title: 'هل انت متأكد من العملية ؟ ',
        text: 'سيتم توليد التقرير بمجرد الموافقة على العملية و لن تتمكن من التعديل مرة اخرى',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'توليد التقرير',
        cancelButtonText: 'الغاء الامر'
      }).then((result) => {
        if (result.isConfirmed) {
          this.submit_generation_request(id)
        }
      })
    },
    submit_generation_request (id) {
      this.$axios.post('/admin/reports/generate', { shift_id: id }).then(() => {
        this.$swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'تمت إرسال طلب التوليد بنجاح',
          showConfirmButton: false,
          timer: 1500
        })
        this.$fetch()
      })
    },
    view_report (id) {
      this.$router.push(`/admin/reports/show/${id}`)
    }
  }
}
</script>
