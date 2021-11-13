<template>
  <body class="barcode">
    <vue-html2pdf
      ref="html2Pdf"
      :show-layout="true"
      :float-layout="false"
      :enable-download="false"
      :preview-modal="true"
      :paginate-elements-by-height="140"
      filename="hee hee"
      :pdf-quality="1.8"
      pdf-format="a5"
      pdf-orientation="portrait"
      :manual-pagination="true"
      :pdf-content-width="196"
      :pdf-content-height="140"
    >
      <v-row>
        <v-col>
          <v-btn @click="generatePdf">
            print
          </v-btn>
        </v-col>
      </v-row>
      <section slot="pdf-content" class="sheet">
        <v-container>
          <Nuxt />
        </v-container>
      </section>
    </vue-html2pdf>
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
  mounted () {
    this.generatePdf()
  },
  methods: {
    generatePdf () {
      this.$refs.html2Pdf.generatePdf()
    }
  }
}
</script>
<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/paper-css/0.3.0/paper.css');
@page {
  height: 3.7cm;
  width: 5.2cm;
 }
 body.barcode           .sheet { width: 52mm; height: 37mm }
 .barcode {
  min-height: 3.7cm;
  min-width: 5.2cm;
  max-height: 3.7cm;
  max-width: 5.2cm;
 }
</style>
