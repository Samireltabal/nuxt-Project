<template>
  <v-col>
    <v-list class="data_list_reciept">
      <v-list-item>
        <span> إسم العميل : </span> {{ record.customer ? record.customer.name : '' }}
      </v-list-item>
      <v-list-item>
        <span> نوع الجهاز : </span> {{ record.device ? record.device.device_name : '' }}
      </v-list-item>
      <v-list-item>
        <span> تليفون العميل : </span> {{ record.customer ? record.customer.phone : '' }}
      </v-list-item>
      <v-list-item>
        <span> عطل الجهاز : </span> {{ record.problem }}
      </v-list-item>
      <v-list-item>
        <span> ملاحظات : </span> {{ record.notes }}
      </v-list-item>
    </v-list>
  </v-col>
</template>
<script>
export default {
  name: 'Print',
  layout: 'A5',
  async asyncData ({ params, $axios }) {
    const record = await $axios.$get(`/maintenance/records/show/${params.id}`)
    return { record }
  },
  data () {
    return {
    }
  },
  computed: {
    record_id () {
      return this.$route.params.id
    }
  },
  mounted () {
    this.$parent.$emit('updateRecordId', this.record.barcode, false)
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
