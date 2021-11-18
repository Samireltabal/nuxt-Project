<template>
  <v-app dark>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="true"
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
      extension-height="36"
      color="indigo"
      dense
      dark
      app
    >
      <v-app-bar-nav-icon @click.stop="miniVariant = !miniVariant" />
      <v-toolbar-title v-text="title" />
      <template #extension>
        <v-tabs align-with-title>
          <v-tab @click="$router.push('/')">
            <v-icon class="mx-2">mdi-home</v-icon> الرئيسية
          </v-tab>
          <v-tab @click="$router.push('/Sales')">
            <v-icon class="mx-2">
              mdi-basket
            </v-icon>
            المبيعات
          </v-tab>
          <v-tab @click="$router.push('/maintenance')">
            <v-icon class="mx-2">
              mdi-wrench
            </v-icon>
            الصيانة
          </v-tab>
          <v-tab @click="$router.push('/Sales?tab=tab-4')">
            <v-icon class="mx-2">
              mdi-television-play
            </v-icon>
            IPTV
          </v-tab>
        </v-tabs>
      </template>
      <v-spacer />
      <Auth />
    </v-app-bar>
    <v-main>
      <v-container fluid>
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
import Auth from '../components/Auth.vue'
export default {
  components: {
    Auth
  },
  middleware: ['shift'],
  data () {
    return {
      clipped: true,
      drawer: true,
      fixed: true,
      items: [
        {
          icon: 'mdi-apps',
          title: 'الرئيسية',
          to: '/'
        },
        {
          icon: 'mdi-account',
          title: 'حسابي',
          logged_in: true,
          to: '/dashboard'
        },
        {
          icon: 'mdi-cart-plus',
          title: 'المبيعات',
          logged_in: true,
          to: '/Sales'
        },
        {
          icon: 'mdi-wrench-outline',
          title: 'الصيانة',
          logged_in: true,
          to: '/maintenance'
        },
        {
          icon: 'mdi-tools',
          title: 'لوحة تحكم الإدارة',
          logged_in: true,
          admin_only: true,
          to: '/admin'
        },
        {
          icon: 'mdi-logout',
          title: 'تسجيل خروج',
          logged_in: true,
          to: '/logout'
        },
        {
          icon: 'mdi-login',
          title: 'تسجيل دخول',
          guest_only: true,
          to: '/login'
        }
      ],
      miniVariant: true,
      right: true,
      rightDrawer: false,
      title: 'بيت الإلكترونيات'
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
