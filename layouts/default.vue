<template>
  <v-app dark class="main-container">
    <v-app-bar color="primary" clipped-left clipped-right fixed app height="56">
      <nuxt-link :to="localePath({ name: 'index' })">
        <img src="@/assets/logo.png" />
      </nuxt-link>
      <v-spacer />
      <search-card />

      <v-spacer />
      <v-btn
        icon
        v-if="currentUser"
        small
        class="mr-3"
        :to="
          localePath({
            name: 'index-user-url',
            params: { url: currentUser.url }
          })
        "
      >
        <v-avatar size="35">
          <img :src="currentUser.profile_photo_path" />
        </v-avatar>
      </v-btn>
      <button-message
        v-if="currentUser && $route.name && !$route.name.includes('messages')"
      />
      <button-notification v-if="currentUser" />
      <button-setting v-if="currentUser" />
    </v-app-bar>
    <v-main ref="main">
      <v-container>
        <loading-calling />
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
      loading: false,
      error: null,
      searchKey: '',
      searchSelected: false
    }
  },
  computed: {
    ...mapGetters('user', ['currentUser']),
    ...mapGetters('message', ['thresh', 'callingUser']),
    messageIcon() {
      return this.$route.name === 'index'
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
  }
}
</script>

<style lang="scss">
html {
  overflow-y: hidden;
  height: 100%;
  &:hover {
    overflow-y: auto;
  }
  &::-webkit-scrollbar {
    width: 0.35rem;
  }
  &::-webkit-scrollbar-track {
    background: white;
    -webkit-border-radius: 10px;
    border-radius: 25px;
    padding: 10px;
  }
  &::-webkit-scrollbar-thumb {
    background: #9c27b0;
    -webkit-border-radius: 10px;
    border-radius: 10px;
  }
}

.overflow-scroll-y {
  overflow-y: auto;
  &:hover {
    overflow-y: auto;
  }
  &::-webkit-scrollbar {
    width: 0.35rem;
  }
  &::-webkit-scrollbar-track {
    background: white;
    -webkit-border-radius: 10px;
    border-radius: 25px;
    padding: 10px;
  }
  &::-webkit-scrollbar-thumb {
    background: #9c27b0;
    -webkit-border-radius: 10px;
    border-radius: 10px;
  }
}

.navbar-button-show-card {
  position: absolute;
  right: 0.5rem;
  top: $navbar-card-top;
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

.hover-up:hover {
  transform: translateY(-10px);
  transition: 0.5s ease-in-out;
}
.hover-up {
  transition: 0.5s ease-in-out;
}
.avatar-outlined {
  border: thin solid rgba(0, 0, 0, 0.12) !important;
}
</style>
