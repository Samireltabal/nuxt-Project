<template>
  <v-layout app>
    <v-container>
      <v-row>
        <v-col>
          {{ customer }}
        </v-col>
      </v-row>
    </v-container>
  </v-layout>
</template>
<script>
export default {
  name: 'Customer',
  layout: 'admin',
  middleware: ['admin'],
  data () {
    return {
      customer: {}
    }
  },
  async fetch () {
    this.customer = []
    const uri = `profiles/customer?uuid=${this.uuid}`
    this.customer = await this.$axios.$get(uri)
  },
  computed: {
    uuid () {
      return this.$route.params.id
    }
  }
}
</script>
