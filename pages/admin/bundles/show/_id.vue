<template>
  <v-layout>
    <v-container fluid>
      <v-row>
        <v-col>
          <h3>باندل</h3>
        </v-col>
        <v-col>
          <pre>
            {{ bundle }}
          </pre>
        </v-col>
      </v-row>
    </v-container>
  </v-layout>
</template>
<script>
export default {
  name: 'Bundle',
  layout: 'admin',
  data () {
    return {
      bundle: {}
    }
  },
  async fetch () {
    this.bundle = await this.$axios.$get(`/pos/bundles/show/${this.bundle_id}`)
  },
  computed: {
    bundle_id () {
      return this.$route.params.id
    }
  }
}
</script>
