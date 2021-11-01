<template>
  <v-container>
    <v-row align="center" justify="center">
      <v-col cols="4">
        <h3>Logging out ..</h3>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  middleware: ['authentication'],
  mounted () {
    this.logout()
  },
  methods: {
    async logout () {
      await this.$auth.logout().then(() => {
        setTimeout(() => {
          this.$router.push('/logout')
        }, 1000)
      })
    }
  }
}
</script>
