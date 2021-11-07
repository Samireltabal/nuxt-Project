<template>
  <div>
    {{ record }}
  </div>
</template>
<script>
export default {
  name: 'Print',
  layout: 'A5',
  data () {
    return {
      record: {}
    }
  },
  async fetch () {
    this.record = await this.$axios.$get(`/maintenance/records/show/${this.record_id}`)
  },
  computed: {
    record_id () {
      return this.$route.params.id
    }
  }
}
</script>
