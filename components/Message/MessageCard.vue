<template>
  <v-card
    class="message-card-component rounded-lg"
    v-click-outside="{
      handler: onClickOutsideWithConditional,
      closeConditional
    }"
    :ripple="false"
    height="448"
    v-if="currentUser"
  >
    <v-toolbar dense flat>
      <v-btn text large class="ml-n3 text-none" v-if="thresh.participants">
        <v-badge
          bordered
          bottom
          color="deep-purple accent-4"
          dot
          offset-x="10"
          offset-y="10"
          class="ml-n9"
          v-if="thresh.participants.online_status.status"
        >
          <v-avatar size="40" class="avatar-outlined">
            <v-img :src="thresh.participants.profile_photo_path"></v-img>
          </v-avatar>
        </v-badge>
        <v-avatar v-else size="40" class="avatar-outlined ml-n9">
          <v-img :src="thresh.participants.profile_photo_path"></v-img>
        </v-avatar>
        <v-col class="mb-n1" cols="5">
          <div class="font-weight-bold mb-0">
            {{ thresh.participants.name | onlyName }}
          </div>
          <span
            class="text-caption"
            v-if="thresh.participants.online_status.status"
          >
            Active now
          </span>
          <span class="text-caption" v-else>
            {{ thresh.participants.online_status.time | offlineTime }}
          </span>
        </v-col>
      </v-btn>

      <v-spacer />
      <v-btn icon small class="mr-2" @click="createNewPrivateCall">
        <v-icon :color="selected ? 'primary' : ''">mdi-video</v-icon>
      </v-btn>
      <v-btn icon small class="mr-2">
        <v-icon :color="selected ? 'primary' : ''">mdi-phone</v-icon>
      </v-btn>
      <v-btn icon small class="mr-2">
        <v-icon :color="selected ? 'primary' : ''">mdi-minus</v-icon>
      </v-btn>
      <v-btn icon small @click="onCloseCard">
        <v-icon :color="selected ? 'primary' : ''">mdi-close</v-icon>
      </v-btn>
    </v-toolbar>
    <v-divider />
    <div class="message-card-text-component" id="container">
      <message-list :loading="loading" />
    </div>
    <div class="message-card-actions-component">
      <v-tooltip top>
        <template v-slot:activator="{ on, attrs }">
          <v-btn small icon text v-bind="attrs" v-on="on">
            <v-icon :color="selected ? 'primary' : ''">
              mdi-plus-circle-outline
            </v-icon>
          </v-btn>
        </template>
        <span>{{ $t('OpenMoreAction') }}</span>
      </v-tooltip>
      <v-tooltip top>
        <template v-slot:activator="{ on, attrs }">
          <v-btn small class="mr-1" icon text v-bind="attrs" v-on="on">
            <v-icon :color="selected ? 'primary' : ''">
              mdi-folder-multiple-image
            </v-icon>
          </v-btn>
        </template>
        <span>{{ $t('OpenMoreAction') }}</span>
      </v-tooltip>
      <v-textarea
        style="padding: 0; border-radius: 15px;"
        color="rgba(0,0,0,0.2)"
        dense
        flat
        hide-details="auto"
        full-width
        outlined
        label="Aa"
        auto-grow
        row-height="20"
        rows="1"
        v-model="text"
        ref="textInput"
        @blur="onBlurTyping"
        @focus="onFocusTyping"
        @keydown.enter.exact.prevent
        @keydown.enter.exact="onSendMessage"
        @keydown.enter.shift.exact="newLine"
        @keydown.esc.exact="onCloseCard"
      >
        <template v-slot:append>
          <v-btn icon width="25" height="25" text class="ml-n2 mr-n2">
            <v-icon size="25" color="success">mdi-arrow-up-circle</v-icon>
          </v-btn>
        </template>
      </v-textarea>
    </div>
  </v-card>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'

export default {
  computed: {
    ...mapGetters('user', ['currentUser']),
    ...mapGetters('message', ['thresh', 'messages']),
    reverseMessages() {
      return this.messages.slice().reverse()
    }
  },
  data() {
    return {
      text: '',
      selected: false,
      active: true,
      loading: false,
      error: null
    }
  },
  methods: {
    ...mapActions('message', [
      'getMessageCard',
      'sendMessage',
      'setThreshCard',
      'setDefaultMessage',
      'deleteMessage'
    ]),
    createNewPrivateCall() {
      const call_id = uuidv4()
      window.socket.emit('create-call', {
        call_id,
        user_id: this.thresh.participants.id,
        user: this.currentUser
      })
      this.$router.push(
        this.localePath({
          name: 'call-call_id',
          params: { call_id },
          query: {
            video: true,
            type: 'private',
            audio: true
          }
        })
      )
      this.$store.commit('message/SET_CALLING_USER', {
        call_id,
        user: this.thresh.participants
      })
    },
    onClickOutsideWithConditional() {
      this.selected = false
    },
    closeConditional(e) {
      return this.selected
    },
    onCloseCard() {
      this.$store.commit('message/SET_THRESH', null)
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
    async fetchData() {
      this.loading = true
      try {
        await this.getMessageCard()
      } catch (err) {
        this.error = err.response.data.message
      }
      this.loading = false
    },
    async onSendMessage() {
      if (this.text) {
        const message = {
          id: Math.random(),
          thresh_id: this.roomId,
          user_id: this.currentUser.id,
          content: this.text
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
              roomId: this.thresh.id,
              message: response.data.data,
              user: this.currentUser
            })
          }
        } catch (err) {
          this.$nuxt.error(err)
        }
      }
    },
    scrollToBottom() {
      var container = this.$el.querySelector('#container')
      container.scrollTop = container.scrollHeight
    },
    newLine() {
      this.text = this.text
    },
    clickCard() {
      this.selected = true
      this.$refs.textInput.focus()
    },
    onFocusInput() {
      console.log('test')
    }
  },
  mounted() {
    this.fetchData()
  },
  watch: {
    thresh() {
      this.setDefaultMessage()
      this.fetchData()
    }
  },
  updated() {
    if (!this.loading) this.scrollToBottom()
  }
}
</script>

<style scoped lang="scss">
.message-card-component {
  position: fixed;
  bottom: 10px;
  z-index: 4;
  width: 330px;
  right: 30px;
  transition: 0.5s ease-in-out;
  &:hover {
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
    transform: translateY(-10px);
    transition: 0.5s ease-in-out;
  }
}
.message-card-text-component {
  overflow-y: hidden;
  height: 350px;
  padding: 5px;
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

.message-card-actions-component {
  position: absolute;
  width: 100%;
  bottom: 0px;
  display: flex;
  padding: 5px 10px 5px;
  align-items: flex-end;
  max-height: 50px;
}
.active-now-icon {
  position: fixed;
  left: -13px;
  top: 10px;
}

.message-text-field {
  height: 100%;
}
</style>
