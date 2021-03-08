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
          class="mx-auto  overflow-scroll-y"
        >
          <v-card-title class="headline  font-weight-black">
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
          </v-card-title>
          <v-container>
            <v-list three-line>
              <v-list-item-group
                v-model="selected"
                active-class="pink--text"
                multiple
              >
                <template v-for="(item, index) in notifications">
                  <v-list-item
                    v-if="item.type.includes('FriendNotification')"
                    :key="item.data.id"
                    inactive
                  >
                    <v-list-item-avatar size="45">
                      <v-img :src="item.data.user.profile_photo_path"></v-img>
                    </v-list-item-avatar>
                    <v-list-item-content>
                      <span class="font-weight-bold">
                        {{ item.data.user.name }}
                      </span>
                      {{ $t('has just sent you a friend invitation') }}
                      <v-row
                        v-if="item.data.status === 'pending'"
                        class="ma-n3"
                      >
                        <v-col cols="6" class="mr-n4 ml-2">
                          <v-btn
                            text
                            outlined
                            block
                            class="light-blue accent-2 text-none"
                            @click="onFriendAccept(index)"
                          >
                            {{ $t('FriendAccept') }}
                          </v-btn>
                        </v-col>
                        <v-col cols="6">
                          <v-btn
                            text
                            block
                            class="text-none"
                            outlined
                            @click="onFriendCancel(index)"
                          >
                            {{ $t('FriendCancel') }}
                          </v-btn>
                        </v-col>
                      </v-row>
                      <span v-else-if="item.data.status === 'accepted'">
                        {{ item.data.user.name }}
                        {{ $t('and you are friend now!') }}
                      </span>
                      <span v-else>
                        {{ $t('You have been refused this user!') }}
                      </span>
                    </v-list-item-content>
                  </v-list-item>
                </template>
              </v-list-item-group>
            </v-list>
          </v-container>
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
    ...mapGetters('notification', ['notifications', 'numberUnread']),
    ...mapGetters('socket', ['socket'])
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
      this.socket.emit('acceptFriend', {
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
