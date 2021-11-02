<template>
  <v-container class="text-center" grid-list-md text-xs-center>
    <v-row align="center" justify="center">
      <v-col cols="6">
        <v-card>
          <v-card-title class="indigo white--text">
            {{ $t('login') }}
          </v-card-title>
          <v-card-text>
            <v-text-field
              v-model="login"
              :label="$t('login')"
            />
            <v-text-field
              v-model="password"
              :label="$t('password')"
            />
          </v-card-text>
          <v-card-actions class="pa-0">
            <v-row no-gutters>
              <v-col cols="12">
                <v-btn
                  block
                  color="success"
                  large
                  class="rounded-0"
                  dark
                  @click="userLogin"
                >
                  <v-icon>mdi-login</v-icon> {{ $t('login') }}
                </v-btn>
              </v-col>
              <v-col cols="6">
                <v-btn block color="warning" large class="rounded-0" dark>
                  <v-icon>mdi-login</v-icon> {{ $t('login') }}
                </v-btn>
              </v-col>
              <v-col cols="6">
                <v-btn block color="indigo" large class="rounded-0" dark>
                  <v-icon>mdi-login</v-icon> {{ $t('login') }}
                </v-btn>
              </v-col>
            </v-row>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  name: 'Login',
  middleware: ['guest'],
  data () {
    return {
      login: null,
      password: null
    }
  },
  methods: {
    async userLogin () {
      try {
        await this.$auth.loginWith('laravelJWT', { data: { login: this.login, password: this.password } }).then((response) => {
          this.$auth.setUserToken(response.data.access_token).then(() => {
            this.$axios.setToken(response.data.access_token, 'Bearer')
          })
          this.$auth.setUser(response.data.user_data)
        }).catch((err) => {
          this.$toast.error(err.response.data.message)
        }).finally(() => {
          // this.$auth.fetchUser()
        })
        // console.log(response)
      } catch (err) {

      }
    }
  }
}
</script>
