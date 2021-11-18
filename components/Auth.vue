<template>
  <span>
    <v-btn
      v-if="!loggedIn"
      text
      @click="$router.push('/login')"
    >
      تسجيل دخول
    </v-btn>
    <v-menu
      v-else
      bottom
      class="mt-2"
      min-width="200px"
      rounded
    >
      <template #activator="{ on }">
        <v-btn
          icon
          small
          v-on="on"
        >
          <v-avatar
            color="brown"
            size="32"
          >
            <img
              :alt="user.name"
              :src="user.avatar"
            >
          </v-avatar>
        </v-btn>
      </template>
      <v-card>
        <v-list-item-content class="justify-center">
          <div class="mx-auto text-center">
            <v-avatar
              color="brown"
            >
              <img
                :alt="user.name"
                :src="user.avatar"
              >
            </v-avatar>
            <h3>{{ user.name }}</h3>
            <p class="text-caption mt-1">
              {{ user.email }}
            </p>
            <v-divider class="my-3" />
            <v-btn
              depressed
              rounded
              text
              @click="$router.push('/dashboard')"
            >
              Edit Account
            </v-btn>
            <v-divider class="my-3" />
            <v-btn
              depressed
              rounded
              text
              @click="$router.push('/logout')"
            >
              Disconnect
            </v-btn>
          </div>
        </v-list-item-content>
      </v-card>
    </v-menu>
  </span>
</template>
<script>
export default {
  name: 'Auth',
  computed: {
    loggedIn () {
      return this.$auth.loggedIn
    },
    user () {
      return this.$auth.user
    }
  }
}
</script>
