<template>
  <v-card
    class="message-card-component rounded-lg"
    v-click-outside="{
      handler: onClickOutsideWithConditional,
      closeConditional
    }"
    :ripple="false"
    height="450"
    @keydown.esc="test"
    @click="clickCard"
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
      <v-btn icon small class="mr-2">
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
    <v-card-text
      class="message-card-text-component text--primary"
      id="container"
    >
      <loading-component v-if="loading" />
      <div v-else-if="messages.length">
        <message-row
          v-for="(message, index) in reverseMessages"
          :key="`message-${message.id}-${message.created_at}`"
          :message="message"
          :same="
            messages[index + 1]
              ? message.user_id !== messages[index + 1].user_id
              : true
          "
          :user="thresh.participants"
        />
      </div>
      <div v-else class="text-center">
        <div>
          <v-avatar class="avatar-outlined" size="100">
            <img :src="thresh.participants.profile_photo_path" />
          </v-avatar>
        </div>
        <div class="font-weight-bold text-body-1">
          {{ thresh.participants.name }}
        </div>
        <div class="text-body-2">
          {{ $t('FriendOnMessage') }}
        </div>
        <div>
          {{ $t('Write something with') }}
          {{ thresh.participants.name | onlyName }}
        </div>
      </div>
    </v-card-text>
    <v-card-actions>
      <v-btn icon small>
        <v-icon :color="selected ? 'primary' : ''">
          mdi-plus-circle-outline
        </v-icon>
      </v-btn>
      <v-btn icon small v-if="!text">
        <v-icon :color="selected ? 'primary' : ''">
          mdi-folder-multiple-image
        </v-icon>
      </v-btn>
      <v-textarea
        label="Write anything ..."
        auto-grow
        rows="1"
        solo
        rounded
        dense
        full-width
        class="mb-n7 ml-2 mr-2"
        v-model="text"
        ref="textInput"
        @keydown.enter.exact.prevent
        @keydown.enter.exact="onSendMessage"
        @keydown.enter.shift.exact="newLine"
      ></v-textarea>
      <v-btn icon small @click="onSendMessage">
        <v-icon :color="selected ? 'primary' : ''"> mdi-send </v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import MessageRow from './MessageRow'
import axios from 'axios'

export default {
  computed: {
    ...mapGetters('user', ['currentUser']),
    ...mapGetters('message', ['thresh', 'messages']),
    reverseMessages() {
      return this.messages.slice().reverse()
    }
  },
  components: {
    MessageRow
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
      'setDefaultMessage'
    ]),
    onClickOutsideWithConditional() {
      this.selected = false
    },
    closeConditional(e) {
      return this.selected
    },
    onCloseCard() {
      this.$store.commit('message/SET_THRESH', null)
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
              userName: this.thresh.participants.name
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

.active-now-icon {
  position: fixed;
  left: -13px;
  top: 10px;
}
</style>
