<template>
  <body class="A5">
    <section class="sheet padding-2mm">
      <v-container>
        <v-row class="no-gutters" align="center" justify="center">
          <v-col cols="6">
            <h3 class="logo ml-10 text-center">
              <v-icon>mdi-chip</v-icon> بيت الإلكترونيات
              <p class="tagline">
                <small>مركز خدمة و صيانة الريسيفر</small>
              </p>
            </h3>
          </v-col>
          <v-col cols="6">
            <v-row>
              <v-col cols="12">
                <h4 class="invoice_heading_line">
                  رقم : {{ record_id }}
                </h4>
                <h5 class="invoice_heading_line">
                  بيت الإلكترونيات
                </h5>
                <h5 class="invoice_heading_line">
                  المحلة الكبرى , شارع 6 اكتوبر امام المستشفى العام
                </h5>
                <h5 class="invoice_heading_line">
                  <v-icon>mdi-phone</v-icon> 0402240050
                </h5>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12">
            <hr>
          </v-col>
          <v-col cols="12" class="text-center">
            <h5 class="page_title mt-1 text-center">
              {{ isInvoice ? 'فاتورة بيع' : 'إيصال إستلام' }}
            </h5>
          </v-col>
        </v-row>
        <v-row>
          <Nuxt @updateRecordId="recordUpdated" />
        </v-row>
        <v-row justify="end" align="end">
          <v-col cols="12">
            <hr>
          </v-col>
          <footer>
            <v-col>
              <!-- eslint-disable-next-line vue/no-v-html -->
              <p class="maintenance_notes" v-html="notes" />
            </v-col>
          </footer>
        </v-row>
      </v-container>
    </section>
  </body>
</template>
<script>
export default {
  name: 'A5',
  data () {
    return {
      record_id: null,
      isInvoice: false,
      notes: null
    }
  },
  methods: {
    async recordUpdated (val, isInvoice) {
      if (!isInvoice) {
        this.notes = await this.$axios.$get('/admin/settings/maintainence_notes')
      } else {
        this.notes = await this.$axios.$get('/admin/settings/invoice_notes')
      }
      this.record_id = val
      this.isInvoice = false
    }
  }
}
</script>
<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/paper-css/0.3.0/paper.css');
@page { size: A5 }
</style>
