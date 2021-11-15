<template>
  <v-layout app>
    <v-container fluid>
      <v-row>
        <v-col>
          {{ server_id }}
        </v-col>
        <v-col>
          <pre>
            {{ server }}
          </pre>
        </v-col>
      </v-row>
    </v-container>
  </v-layout>
</template>
<script>
export default {
  name: 'Server',
  layout: 'admin',
  data () {
    return {
      server: {}
    }
  },
  async fetch () {
    this.server = await this.$axios.$get(`/pos/iptv/server?server_id=${this.server_id}`)
  },
  computed: {
    server_id () {
      return this.$route.params.server
    }
  }
}
</script>
