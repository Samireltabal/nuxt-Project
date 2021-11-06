<template>
  <v-layout>
    <v-row>
      <v-col>
        {{ id }}
      </v-col>
      <v-col>
        {{ record }}
      </v-col>
    </v-row>
  </v-layout>
</template>
<script>
export default {
  name: 'ShowRecord',
  data () {
    return {
      record: []
    }
  },
  async fetch () {
    this.record = await this.$axios.$get(`/maintenance/records/show/${this.id}`)
  },
  computed: {
    id () {
      return this.$route.params.id
    }
  }
}
</script>
