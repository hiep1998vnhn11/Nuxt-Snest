<template>
  <v-app dark class="main-container">
    <v-app-bar
      color="primary"
      clipped-left
      clipped-right
      fixed
      app
      height="56"
      class="elevation-3"
    >
      <v-btn
        v-if="currentUser"
        icon
        small
        :to="localePath({ name: 'user-url', params: { url: currentUser.url } })"
      >
        <v-avatar size="30">
          <img :src="currentUser.profile_photo_path" />
        </v-avatar>
      </v-btn>
      <v-spacer />
      <v-card
        id="search-card-app-bar"
        v-click-outside="{
          handler: onClickOutsideWithConditional,
          closeConditional
        }"
        width="400"
        :class="`elevation-${searchSelected ? 5 : 0} ml-n4`"
      >
        <v-app-bar height="56" flat color="primary">
          <v-text-field
            v-model="searchKey"
            class="grey lighten-3 ml-2"
            rounded
            hide-details
            :label="$t('Search')"
            @focus="searchSelected = true"
          >
            <template v-slot:prepend-inner class="mr-n2">
              <v-icon class="ml-n4">mdi-magnify</v-icon>
            </template>
          </v-text-field>
        </v-app-bar>
        <v-container v-if="searchSelected">
          <v-row class="mx-auto font-weight-black">
            {{ $t('Home.SearchResult') }}
          </v-row>
          {{ $t('Home.SearchNoResult') }}
        </v-container>
      </v-card>
      <v-spacer />
      <button-message />
      <button-notification />
      <button-setting />
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
      loadingMessageCard: false,
      loading: false,
      error: null,
      searchKey: '',
      searchSelected: false,
      mini: false
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
    onClickOutsideWithConditional() {
      this.searchSelected = false
    },
    closeConditional(e) {
      return this.searchSelected
    },
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

<style scoped>
.home-navbar-right::-webkit-scrollbar {
  width: 0.25rem;
}

.home-navbar-right::-webkit-scrollbar-track {
  background: white;
}

.home-navbar-right::-webkit-scrollbar-thumb {
  background: #0077ff;
}

#search-card-app-bar {
  position: fixed;
  top: 0px;
  left: 50%;
  z-index: 9999;
  transform: translateX(-50%);
}

.row-divider-vertical {
  margin: 0 -0.5px;
}
</style>
