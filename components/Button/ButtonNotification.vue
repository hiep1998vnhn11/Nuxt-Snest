<template>
  <div>
    <v-tooltip bottom>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          width="40"
          height="40"
          outlined
          icon
          text
          :class="`mx-1 ${classes}`"
          :loading="loading"
          @click="onClick"
        >
          <v-badge :content="numberUnread" :value="numberUnread" color="green">
            <v-icon v-bind="attrs" v-on="on">mdi-bell</v-icon>
          </v-badge>
        </v-btn>
      </template>
      <span>{{ $t('common.notification') }}</span>
    </v-tooltip>
    <div class="navbar-button-show-card">
      <v-expand-transition right>
        <v-card
          v-show="expand"
          v-click-outside="{
            handler: onClickOutsideWithConditional,
            closeConditional
          }"
          width="22rem"
          class="appbar-card-height"
        >
          <v-toolbar flat dense class="font-weight-bold">
            Notifications
            <v-spacer />
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn small outlined icon text>
                  <v-icon v-bind="attrs" v-on="on">mdi-dots-horizontal</v-icon>
                </v-btn>
              </template>
              <span>{{ $t('NotificationSetting') }}</span>
            </v-tooltip>
          </v-toolbar>
          <div class="overflow-scroll-y px-2 card-container">
            <router-link
              custom
              to="/"
              v-slot="{ href, navigate }"
              v-for="notification in notifications"
              :key="`notification-${notification.id}`"
            >
              <div
                class="notification-list-element pa-2 mb-1"
                :href="href"
                @click="navigate"
              >
                <v-avatar class="avatar-outlined mr-3" size="60">
                  <img :src="notification.data.image" />
                </v-avatar>
                <div>
                  <strong>{{ notification.data.username }}</strong>
                  ashdkjashjksdfhksd fhjksdfhdjksfhjsdfsd
                </div>
              </div>
            </router-link>
          </div>
        </v-card>
      </v-expand-transition>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { mapGetters, mapActions } from 'vuex'

export default {
  data() {
    return {
      expand: false,
      loading: false,
      error: null,
      selected: []
    }
  },
  computed: {
    classes() {
      return this.expand ? 'primary--text blue lighten-4' : null
    },
    ...mapGetters('notification', ['notifications', 'numberUnread'])
  },
  mounted() {
    this.fetchUnread()
  },
  methods: {
    ...mapActions('notification', ['getNotifications', 'getNumberUnread']),
    onClickOutsideWithConditional() {
      this.expand = false
    },
    closeConditional(e) {
      return this.expand
    },
    async fetchUnread() {
      try {
        await this.getNumberUnread()
      } catch (err) {
        this.error = err.response.data.message
      }
    },
    async fetchData() {
      if (this.notifications.length !== 0) return
      this.loading = true
      this.selected = [...Array(this.numberUnread).keys()]
      try {
        await this.getNotifications()
      } catch (err) {
        this.error = err.response.data.message
      }
      this.loading = false
    },
    onClick() {
      if (!this.expand) this.fetchData()
      this.expand = true
    },
    onFriendAccept(index) {
      this.notifications[index].data.status = 'accepted'
      // const response = await axios.post(`/v1/user/friend/${this.notifications[index].id}/accept`)
      const response = 'hello'
      window.socket.emit('acceptFriend', {
        userId: this.notifications[index].data.user.id,
        response
      })
    },
    async onFriendCancel(index) {
      this.notifications[index].data.status = 'canceled'
      await axios.post('/v1/user/friend/123/denied')
    }
  }
}
</script>

<style lang="scss" scoped>
.appbar-card-height {
  position: relative;
  max-height: calc(100vh - 74px);
  .card-container {
    position: relative;
    max-height: calc(100vh - 120px);

    .notification-list-element {
      display: flex;
      cursor: pointer;
      border-radius: 5px;
      &:hover {
        background: rgba(0, 0, 0, 0.1);
      }
    }
  }
}
</style>
