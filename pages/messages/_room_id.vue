<template>
  <div v-if="thresh">
    <v-app-bar absolute clipped-right flat>
      <v-badge
        bordered
        bottom
        color="deep-purple accent-4"
        dot
        :value="thresh.participants.online_status.status"
        offset-x="12"
        offset-y="12"
      >
        <v-avatar class="avatar-outlined">
          <v-img :src="thresh.participants.profile_photo_path"></v-img>
        </v-avatar>
      </v-badge>
      <v-list-item two-line>
        <v-list-item-content>
          <v-list-item-title
            class="font-weight-bold text-capitalize"
            v-text="thresh.participants.name"
          />
          <v-list-item-subtitle>
            <span v-if="thresh.participants.online_status.status">
              {{ $t('Active Now') }}
            </span>
            <span v-else>
              {{ $t('Active') }}
              {{ thresh.participants.online_status.time | relativeTime }}
            </span>
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-spacer></v-spacer>
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn small icon text v-bind="attrs" v-on="on">
            <v-icon color="primary">mdi-phone</v-icon>
          </v-btn>
        </template>
        <span>{{ $t('StartVoiceCall') }}</span>
      </v-tooltip>
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn small icon text v-bind="attrs" class="ml-3" v-on="on">
            <v-icon color="primary">mdi-video</v-icon>
          </v-btn>
        </template>
        <span>{{ $t('StartVideoCall') }}</span>
      </v-tooltip>
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            small
            icon
            text
            v-bind="attrs"
            class="ml-3 mr-1"
            v-on="on"
            @click="$emit('onConvert')"
          >
            <v-icon color="primary">mdi-information-outline</v-icon>
          </v-btn>
        </template>
        <span>{{ $t('ConversationInformation') }}</span>
      </v-tooltip>
    </v-app-bar>

    <!-- bottom appbar -->
    <v-footer app height="56" color="grey lighten-3" inset>
      <v-tooltip top>
        <template v-slot:activator="{ on, attrs }">
          <v-btn small icon text v-bind="attrs" class="ml-n3" v-on="on">
            <v-icon color="primary">mdi-plus-circle</v-icon>
          </v-btn>
        </template>
        <span>{{ $t('OpenMoreAction') }}</span>
      </v-tooltip>
      <v-tooltip top>
        <template v-slot:activator="{ on, attrs }">
          <v-btn small icon text v-bind="attrs" class="ml-3" v-on="on">
            <v-icon color="primary">mdi-image-multiple</v-icon>
          </v-btn>
        </template>
        <span>{{ $t('AttachPhotoVideo') }}</span>
      </v-tooltip>
      <v-tooltip top>
        <template v-slot:activator="{ on, attrs }">
          <v-btn small icon text v-bind="attrs" class="ml-3 mr-3" v-on="on">
            <v-icon color="primary">mdi-sticker-emoji</v-icon>
          </v-btn>
        </template>
        <span>{{ $t('ChooseSticker') }}</span>
      </v-tooltip>
      <v-text-field
        background-color="grey lighten-1"
        dense
        flat
        hint
        autocomplete="off"
        hide-details
        rounded
        solo
        label="Aa"
        @focus="onFocusTyping"
        @blur="onBlurTyping"
        @keydown.enter.exact.prevent
        @keydown.enter.exact="onSendMessage"
        @keydown.enter.shift.exact="newLine"
        v-model="text"
      >
        <template v-slot:append>
          <v-btn icon text class="mr-n6" @click="$emit('onConvert')">
            <v-icon color="primary">mdi-emoticon</v-icon>
          </v-btn>
        </template>
      </v-text-field>
      <v-tooltip top>
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon text v-bind="attrs" class="ml-1" v-on="on">
            <v-icon color="primary">mdi-send</v-icon>
          </v-btn>
        </template>
        <span>{{ $t('SendLike') }}</span>
      </v-tooltip>
    </v-footer>

    <v-navigation-drawer width="22rem" app clipped right>
      <template v-slot:prepend>
        <div class="text-center mt-5">
          <v-avatar class="avatar-outlined" size="100">
            <img :src="thresh.participants.profile_photo_path" />
          </v-avatar>
          <div class="font-weight-bold text-capitalize mt-2">
            <nuxt-link
              :to="
                localePath({
                  name: 'index-user-url',
                  params: { url: thresh.participants.url }
                })
              "
              class="black--text text-decoration-none"
            >
              {{ thresh.participants.name }}
            </nuxt-link>
          </div>
        </div>
      </template>
      <v-list nav dense>
        <v-list-group :value="false" prepend-icon="mdi-cog">
          <template v-slot:activator>
            <v-list-item-title v-text="$t('CustomizeChat')"></v-list-item-title>
          </template>
          <v-list-item link>
            <v-list-item-title v-text="$t('ChangeTheme')"></v-list-item-title>
            <v-list-item-icon>
              <v-icon>mdi-theme-light-dark</v-icon>
            </v-list-item-icon>
          </v-list-item>
          <v-list-item link>
            <v-list-item-title v-text="$t('ChangeEmoji')"></v-list-item-title>
            <v-list-item-icon>
              <v-icon>mdi-sticker-emoji</v-icon>
            </v-list-item-icon>
          </v-list-item>
        </v-list-group>

        <!-- Group only -->
        <!-- <v-list-group :value="false" prepend-icon="mdi-account-group">
          <template v-slot:activator>
            <v-list-item-title v-text="$t('Members')"></v-list-item-title>
          </template>
          members
        </v-list-group> -->

        <v-list-group :value="false" prepend-icon="mdi-lock-outline">
          <template v-slot:activator>
            <v-list-item-title
              v-text="$t('Privacy&Support')"
            ></v-list-item-title>
          </template>
          <v-list-item link>
            <v-list-item-title
              v-text="$t('MuteConversation')"
            ></v-list-item-title>
            <v-list-item-icon>
              <v-icon>mdi-bell</v-icon>
            </v-list-item-icon>
          </v-list-item>
          <v-list-item link>
            <v-list-item-title v-text="$t('IgnoreMessage')"></v-list-item-title>
            <v-list-item-icon>
              <v-icon>mdi-message-bulleted-off</v-icon>
            </v-list-item-icon>
          </v-list-item>
          <v-list-item link>
            <v-list-item-title v-text="$t('BlockUser')"></v-list-item-title>
            <v-list-item-icon>
              <v-icon>mdi-account-remove</v-icon>
            </v-list-item-icon>
          </v-list-item>
          <v-list-item link>
            <v-list-item-title
              v-text="$t('SomethingWentWrong')"
            ></v-list-item-title>
            <v-list-item-icon>
              <v-icon>mdi-exclamation</v-icon>
            </v-list-item-icon>
          </v-list-item>
        </v-list-group>
        <v-list-group :value="false" prepend-icon="mdi-folder-image">
          <template v-slot:activator>
            <v-list-item-title v-text="$t('SharedPhoto')"></v-list-item-title>
          </template>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>

    <div class="message-container">
      <message-list :loading="loading" />
    </div>
  </div>
  <div v-else>
    {{ messages }}
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import axios from 'axios'

export default {
  data() {
    return {
      loading: false,
      error: null,
      text: '',
      load: false,
      rightDrawer: true
    }
  },
  computed: {
    ...mapGetters('user', ['currentUser']),
    ...mapGetters('message', ['messages', 'thresh']),
    ...mapGetters('app', ['mini', 'drawer']),
    breakPoint() {
      return this.$vuetify.breakpoint.name
    },
    messageReverse() {
      return this.messages.slice().reverse()
    }
  },
  watch: {
    '$route.params'() {
      this.setDefaultMessage()
      this.fetchData()
    }
  },
  updated() {
    if (this.load) this.load = false
    else this.scrollToBottom()
  },
  mounted() {
    this.setDefaultMessage()
    this.fetchData()
    // this.scrollToBottom()
  },
  middleware: 'auth',
  methods: {
    ...mapActions('message', ['setDefaultMessage', 'getMessageCard']),
    ...mapActions('thresh', ['getParticipant']),
    async fetchData() {
      this.loading = true
      try {
        let url = `/v1/user/thresh/${this.$route.params.room_id}/participant/get`
        const response = await axios.post(url)
        if (response.data.data)
          this.$store.commit('message/SET_THRESH', {
            id: this.$route.params.room_id,
            participants: response.data.data,
            typing: false
          })
        await this.getMessageCard()
      } catch (err) {
        this.$nuxt.error(err)
      }
      this.loading = false
    },
    async fetchMessage() {
      this.loading = true
      try {
        await this.getMessageCard()
      } catch (err) {
        this.$nuxt.error(err)
      }
      this.loading = false
    },
    convertInfo() {
      this.$emit('convert-info')
    },
    onFocusTyping() {
      window.socket.emit('typingUser', {
        userId: this.thresh.participants.id,
        userName: this.thresh.participants.name,
        roomId: this.thresh.id,
        isTyping: true
      })
    },
    onBlurTyping() {
      window.socket.emit('typingUser', {
        userId: this.thresh.participants.id,
        userName: this.thresh.participants.name,
        roomId: this.thresh.id,
        isTyping: false
      })
    },
    async onSendMessage() {
      if (this.text) {
        const message = {
          id: Math.random(),
          thresh_id: this.$route.params.room_id,
          user_id: this.currentUser.id,
          content: this.text,
          user: {
            id: this.currentUser.id,
            name: this.currentUser.name
          }
        }
        this.$store.commit('message/SEND_MESSAGE', message)
        this.text = ''
        try {
          const url = `/v1/user/thresh/${this.thresh.id}/message/send`
          const response = await axios.post(url, {
            content: message.content
          })
          if (this.thresh.participants.id !== this.currentUser.id) {
            window.socket.emit('sendToUser', {
              userId: this.thresh.participants.id,
              roomId: this.$route.params.room_id,
              message: response.data.data,
              userName: this.thresh.participants.name
            })
          }
        } catch (err) {
          this.$nuxt.error(err)
        }
        this.load = true
      }
    },
    scrollToBottom() {
      const container = this.$el.querySelector('#messageContainer')
      if (container) container.scrollTop = container.scrollHeight
    },
    intersected() {
      this.fetchMessage()
    },
    newLine() {
      console.log('new line')
    }
  }
}
</script>

<style lang="scss">
.message-container {
  overflow-y: hidden;
  padding: 5px;
  position: absolute;
  width: 100%;
  height: calc(100% - 64px);
  top: 64px;
  left: 0;

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
</style>
