<template>
  <v-app dark>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      dense
      app
    >
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
          :class="handleVisibility(item) ? '' : 'd-none'"
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar
      :clipped-left="clipped"
      fixed
      app
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-btn
        icon
        @click.stop="miniVariant = !miniVariant"
      >
        <v-icon>mdi-{{ `chevron-${miniVariant ? 'right' : 'left'}` }}</v-icon>
      </v-btn>
      <v-btn
        icon
        @click.stop="clipped = !clipped"
      >
        <v-icon>mdi-application</v-icon>
      </v-btn>
      <v-btn
        icon
        @click.stop="fixed = !fixed"
      >
        <v-icon>mdi-minus</v-icon>
      </v-btn>
      <v-toolbar-title v-text="title" />
      <v-spacer />
      <v-btn
        icon
        @click.stop="rightDrawer = !rightDrawer"
      >
        <v-icon>mdi-menu</v-icon>
      </v-btn>
    </v-app-bar>
    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>
    <v-navigation-drawer
      v-model="rightDrawer"
      :right="right"
      temporary
      fixed
    >
      <v-list>
        <v-list-item @click.native="right = !right">
          <v-list-item-action>
            <v-icon light>
              mdi-repeat
            </v-icon>
          </v-list-item-action>
          <v-list-item-title>Switch drawer (click me)</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-footer
      :absolute="!fixed"
      app
    >
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  middleware: ['shift'],
  data () {
    return {
      clipped: true,
      drawer: false,
      fixed: true,
      items: [
        {
          icon: 'mdi-apps',
          title: 'Welcome',
          to: '/'
        },
        {
          icon: 'mdi-chart-bubble',
          title: 'Inspire',
          logged_in: true,
          to: '/inspire'
        },
        {
          icon: 'mdi-chart-bubble',
          title: 'Dashboard',
          logged_in: true,
          to: '/dashboard'
        },
        {
          icon: 'mdi-wrench-outline',
          title: 'Maintenance',
          logged_in: true,
          to: '/maintenance'
        },
        {
          icon: 'mdi-chart-bubble',
          title: 'Admin Panel',
          logged_in: true,
          admin_only: true,
          to: '/admin'
        },
        {
          icon: 'mdi-account-multiple',
          title: 'Users',
          logged_in: true,
          to: '/users'
        },
        {
          icon: 'mdi-logout',
          title: 'Logout',
          logged_in: true,
          to: '/logout'
        },
        {
          icon: 'mdi-login',
          title: 'Login',
          guest_only: true,
          to: '/login'
        }
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Vuetify.js'
    }
  },
  computed: {
    logged_in () {
      return this.$store.state.auth.loggedIn
    },
    token () {
      return this.$auth.strategy.token.get()
    },
    user () {
      return this.$store.state.auth.user
    }
  },
  mounted () {
    this.$axios.setToken(this.token, 'Bearer')
  },
  methods: {
    handleVisibility (item) {
      if (item.logged_in) {
        if (!this.logged_in) {
          return false
        }
      }
      if (item.guest_only) {
        if (this.logged_in) {
          return false
        }
      }
      if (item.admin_only) {
        if (this.user.role !== 'admin') {
          return false
        }
      }
      return true
    }
  }
}
</script>
