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
          <v-list-item-action v-if="!item.is_divider">
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content v-if="!item.is_divider">
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
          <v-divider v-if="item.is_divider" />
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar
      :clipped-left="clipped"
      fixed
      app
      dense
    >
      <v-toolbar-title v-text="title" />
      <v-spacer />
      <v-app-bar-nav-icon @click.stop="miniVariant = !miniVariant" />
    </v-app-bar>
    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>
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
  data () {
    return {
      clipped: true,
      drawer: true,
      fixed: true,
      items: [
        {
          icon: 'mdi-home-analytics',
          title: 'Admin Panel Home',
          logged_in: true,
          admin_only: true,
          to: '/admin'
        },
        {
          icon: 'mdi-account-multiple',
          title: 'Users',
          logged_in: true,
          admin_only: true,
          to: '/admin/accounts'
        },
        {
          icon: 'mdi-account-multiple',
          title: 'Customers',
          logged_in: true,
          admin_only: true,
          to: '/admin/customers'
        },
        {
          icon: 'mdi-shield-lock',
          title: 'Roles',
          logged_in: true,
          admin_only: true,
          to: '/admin/roles'
        },
        {
          is_divider: true
        },
        {
          icon: 'mdi-home',
          title: 'Back Home Page',
          logged_in: true,
          admin_only: true,
          to: '/'
        },
        {
          icon: 'mdi-logout',
          title: 'Logout',
          logged_in: true,
          to: '/logout'
        }
      ],
      miniVariant: false,
      title: 'Admin Panel'
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
