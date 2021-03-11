import colors from 'vuetify/es5/util/colors'

export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s Snest',
    title: 'Snest',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],
  router: {
    middleware: 'fetchUser'
  },
  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: ['plugins/axios', 'plugins/filters', 'plugins/notification'],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify'
  ],
  loading: '~/components/LoadingIndicator.vue',
  loadingIndicator: {
    name: 'circle',
    color: 'purple',
    background: '#1A5CFF'
  },

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: ['nuxt-i18n'],
  i18n: {
    locales: [
      {
        code: 'en',
        file: 'en.js'
      },
      {
        code: 'vi',
        file: 'vi.js'
      },
      {
        code: 'ja',
        file: 'ja.js'
      }
    ],
    lazy: true,
    langDir: 'lang/',
    defaultLocale: 'en'
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: false,
      themes: {
        dark: {
          primary: colors.blue.darken1,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        },
        light: {
          primary: '#1A5CFF',
          secondary: '#0084FF',
          accent: colors.indigo.base,
          background: colors.grey.lighten3,
          success: '#47C93A',
          danger: '#FE4657',
          warning: '#FFBA00',
          dark: '#1F1F1F',
          colorRed: '#FE4657'
        }
      }
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {}
}
