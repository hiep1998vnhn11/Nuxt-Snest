<template>
  <v-app dark class="main-container">
    <notifications group="message" position="bottom left" width="320">
      <template slot="body" slot-scope="props">
        <div class="message-group-notification">
          <div @click="onClickMessageNotification">
            <div class="title">
              {{ $t('MessageNotification') }}
            </div>

            <div class="content">
              <v-avatar size="60" class="outlined avatar">
                <img :src="props.item.text.user.profile_photo_path" />
              </v-avatar>
              <div class="text">
                <div>
                  <strong>{{ props.item.text.user.name }}</strong>
                  {{ $t('sent you an message') }} :
                </div>
                <div class="message">
                  {{ props.item.text.message.content | shorterValue }}
                </div>
              </div>
            </div>
          </div>
          <v-btn class="title-btn" icon text x-small @click="props.close">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </div>
      </template>
    </notifications>

    <notifications
      group="call"
      position="bottom right"
      width="400"
      duration="negative"
    >
      <template slot="body" slot-scope="props">
        <div class="call-group-notification">
          <v-img
            width="100%"
            max-height="400px"
            style="border-radius: 20px;"
            :src="props.item.text.user.profile_photo_path"
          />

          <div class="call-group-after">
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  class="call-action-refuse danger"
                  icon
                  small
                  v-bind="attrs"
                  v-on="on"
                  @click="onRefuseCalling(props)"
                >
                  <v-icon color="black">
                    mdi-phone-cancel
                  </v-icon>
                </v-btn>
              </template>
              <span>{{ $t('RefuseCall') }}</span>
            </v-tooltip>
            <div class="call-content">
              <v-avatar size="60" class="call-avatar">
                <img :src="props.item.text.user.profile_photo_path" />
              </v-avatar>
              <div class="white--text">
                <strong>{{ props.item.text.user.name }}</strong>
                {{ $t('isCallingYou') }}
              </div>
            </div>
            <div class="call-actions">
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    v-bind="attrs"
                    v-on="on"
                    icon
                    text
                    class="dark"
                    color="white"
                  >
                    <v-icon>mdi-camcorder</v-icon>
                  </v-btn>
                </template>
                <span>{{ $t('TurnOnCamera') }}</span>
              </v-tooltip>
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    v-bind="attrs"
                    v-on="on"
                    icon
                    x-large
                    class="success mx-5"
                    @click="onAnswerCalling(props)"
                  >
                    <v-icon>mdi-phone</v-icon>
                  </v-btn>
                </template>
                <span>{{ $t('Answer') }}</span>
              </v-tooltip>

              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn class="dark" v-bind="attrs" v-on="on" icon>
                    <v-icon color="white">
                      mdi-microphone
                    </v-icon>
                  </v-btn>
                </template>
                <span> {{ $t('TurnOnMicro') }} </span>
              </v-tooltip>
            </div>
          </div>
        </div>
      </template>
    </notifications>

    <v-app-bar color="primary" clipped-left clipped-right fixed app height="56">
      <nuxt-link :to="localePath({ name: 'index' })">
        <img src="@/assets/logo.png" />
      </nuxt-link>
      <v-spacer />
      <search-card />
      <v-spacer />
      <button-message
        v-if="currentUser && $route.name && !$route.name.includes('messages')"
      />
      <button-notification v-if="currentUser" />
      <v-btn
        icon
        v-if="currentUser"
        small
        :to="
          localePath({
            name: 'index-user-url',
            params: { url: currentUser.url }
          })
        "
        class="mx-3"
      >
        <v-avatar size="40">
          <img :src="currentUser.profile_photo_path" />
        </v-avatar>
      </v-btn>
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
      searchSelected: false,
      calling: null
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
    },
    onClickMessageNotification() {},
    onAnswerCalling(props) {
      props.close()
      this.$router.push(
        this.localePath({
          name: 'call-call_id',
          params: {
            call_id: props.item.text.call_id
          }
        })
      )
    },
    onRefuseCalling(props) {
      window.socket.emit('refuse-call', {
        call_id: props.item.text.call_id,
        user_id: props.item.text.user.id
      })
      props.close()
    }
  },
  mounted() {
    if (window.socket) {
      window.socket.on(
        'receiptMessage',
        ({ userId, roomId, message, user }) => {
          console.log('get an messaged!')
          if (
            this.$store.getters['message/thresh'] &&
            Number(this.$store.getters['message/thresh'].id) ===
              Number(this.$message.thresh_id)
          ) {
            this.$store.commit('message/RECEIVED_MESSAGE', message)
          } else {
            this.$notify({
              group: 'message',
              text: {
                message,
                user
              }
            })
          }
        }
      )

      window.socket.on('people-calling', calling => {
        this.$notify({
          group: 'call',
          text: calling
        })
      })
    }
  }
}
</script>

<style lang="scss">
html {
  overflow-y: hidden;
  height: 100%;
  font-family: inherit;
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
  overflow-x: hidden;
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
