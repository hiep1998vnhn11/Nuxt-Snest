<template>
  <v-app dark class="main-container">
    <v-app-bar color="primary" fixed app>
      <v-app-bar-title v-text="title" />
      <v-spacer />
    </v-app-bar>
    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import axios from 'axios'
export default {
  data() {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: 'mdi-apps',
          title: 'Welcome',
          to: '/'
        },
        {
          icon: 'mdi-chart-bubble',
          title: 'Inspire',
          to: '/inspire'
        }
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Vuetify.js',
      loading: false,
      error: null,
      loadingMessageCard: false
    }
  },
  computed: {
    ...mapGetters('user', ['currentUser']),
    ...mapGetters('socket', ['socket']),
    ...mapGetters('message', ['thresh']),
    messageIcon() {
      return this.$route.name === 'Home'
        ? 'mdi-pencil-circle-outline'
        : 'mdi-account-multiple-outline'
    },
    ...mapGetters('message', ['messageCards'])
  },
  methods: {
    ...mapActions('user', ['getUser']),
    ...mapActions('message', [
      'closeMessageCard',
      'newMessage',
      'setThreshCard'
    ]),
    ...mapActions('socket', ['connectSocket']),
    async fetchUser() {
      this.error = null
      this.loading = true
      try {
        await this.getUser()
      } catch (err) {
        this.error = err.toString()
      }
      this.loading = false
    },
    async onOpenMessage(user) {
      this.loadingMessageCard = true
      try {
        const response = await axios.post(`/v1/user/thresh/${user.id}/get`)
        if (response.data.data) {
          this.thresh = response.data.data
        } else {
          this.thresh = { user_with: user }
        }
      } catch (err) {
        this.error = err.response.data.message
      }
      this.loadingMessageCard = false
    }
  },
  async created() {
    if (!this.currentUser) await this.fetchUser()
    // if (!this.socket || this.socket.disconnected) this.connectSocket()
  }
}
</script>

<style scoped></style>
