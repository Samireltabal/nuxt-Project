import colors from 'vuetify/es5/util/colors'

export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s - syncProject',
    title: 'syncProject',
    htmlAttrs: {
      lang: 'ar',
      dir: 'rtl'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', type: 'stylesheet/css', href: 'https://fonts.googleapis.com/css2?family=Cairo:wght@400;700&display=swap' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '~assets/global.css'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '~/plugins/luxon.js',
    { src: '~/plugins/html2pdf', mode: 'client' }
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/toast',
    ['vue-sweetalert2/nuxt'],
    { src: '@nuxtjs/axios', mode: 'client' },
    { src: '@nuxtjs/auth-next', mode: 'client' },
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
    [
      '@nuxtjs/i18n',
      {
        locales: ['en', 'ar'],
        defaultLocale: 'en',
        vueI18n: {
          fallbackLocale: 'en',
          messages: {
            en: {
              greeting: 'Hello world!',
              login: 'Login'
            },
            ar: {
              greeting: '¡Hola mundo!',
              login: 'تسجيل دخول'
            }
          }
        }
      }
    ]
  ],
  sweetalert: {
    confirmButtonColor: '#41b882',
    cancelButtonColor: '#ff7674'
  },
  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    BaseURL: 'https://app.synciteg.com/api/'
  },
  toast: {
    position: 'top-center',
    duration: '1000'
  },
  auth: {
    strategies: {
      laravelJWT: {
        provider: 'laravel/jwt',
        url: process.env.BASE_URL || 'https://app.synciteg.com/api/',
        rewriteRedirects: true,
        fullPathRedirect: true,
        watchLoggedIn: false,
        endpoints: {
          login: { url: 'auth/login', method: 'post', propertyName: 'access_token' },
          logout: { url: 'auth/logout', method: 'post' },
          user: { url: 'auth/user', method: 'get' }
        },
        token: {
          property: 'access_token',
          maxAge: 60 * 60
        },
        refreshToken: {
          maxAge: 20160 * 60
        }
      }
    }
  },
  publicRuntimeConfig: {
    axios: {
      baseURL: process.env.VUE_APP_BASE_URL
    }
  },
  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      lang: 'en'
    }
  },
  router: {
    middleware: 'shift'
  },
  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    rtl: true,
    theme: {
      dark: false,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  }
}
