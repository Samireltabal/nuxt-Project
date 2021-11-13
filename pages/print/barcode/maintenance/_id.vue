<template>
  <v-col ref="content" class="pa-0 ma-0">
    <div>
      <img :src="record.BarcodeUrl">
    </div>
  </v-col>
</template>
<script>
import jsPDF from 'jspdf'
// import html2canvas from 'html2canvas'
export default {
  name: 'Print',
  layout: 'pdf',
  async asyncData ({ params, $axios }) {
    const record = await $axios.$get(`/maintenance/records/show/${params.id}`)
    return { record }
  },
  data () {
    return {
      imageBlob: null
    }
  },
  computed: {
    record_id () {
      return this.$route.params.id
    }
  },
  mounted () {
    const logo = this.getDataUri(this.record.BarcodeUrl)
    // eslint-disable-next-line new-cap
    const doc = new jsPDF({
      orientation: 'l',
      unit: 'mm',
      format: [37, 52]
    })
    const left = 15
    const top = 8
    const imgWidth = 100
    const imgHeight = 100
    doc.addImage(logo, 'jpg', left, top, imgWidth, imgHeight)

    doc.save('sample.pdf') // opens pdf in new tab
  },
  methods: {
    getDataUri (url) {
      this.$axios.get(url, {
        responseType: 'arraybuffer'
      }).then((response) => {
        this.imageBlob = response.blob()
        return response.blob()
      })
    }
  }
}
</script>
<style scoped>
.v-list-item {
 min-height: 30px;
}
.v-list-item > span {
  font-weight: bold;
}
@media print {
  footer {page-break-after: always;}
}
</style>
