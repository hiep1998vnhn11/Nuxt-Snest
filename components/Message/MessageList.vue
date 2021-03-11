<template>
  <div>
    <loading-component v-if="loading" />
    <div v-else-if="messages.length">
      <message-row
        v-for="(message, index) in reverseMessages"
        :key="`message-${message.id}`"
        :message="message"
        :current="message.user_id == currentUser.id"
        :user="thresh.participants"
        @deleteMessasge="onDeleteMessage(index, message.id)"
        @reverseMessage="onReverseMessage(index, message.id)"
      />
      <v-fade-transition>
        <message-row
          v-if="thresh.typing"
          :user="thresh.participants"
          :typing="thresh.typing"
        />
      </v-fade-transition>
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
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  props: ['loading'],
  data() {
    return {}
  },
  methods: {
    ...mapActions('message', [
      'getMessageCard',
      'sendMessage',
      'setThreshCard',
      'setDefaultMessage',
      'deleteMessage',
      'reverseMessage'
    ]),
    async onDeleteMessage(messageIndex, messageId) {
      try {
        await this.deleteMessage({ messageIndex, messageId })
      } catch (err) {
        this.$nuxt.error(err)
      }
    },
    async onReverseMessage(messageIndex, messageId) {
      try {
        await this.reverseMessage({ messageIndex, messageId })
      } catch (err) {
        this.$nuxt.error(err)
      }
    }
  },
  computed: {
    ...mapGetters('user', ['currentUser']),
    ...mapGetters('message', ['thresh', 'messages']),
    reverseMessages() {
      return this.messages.slice().reverse()
    }
  }
}
</script>
<style scoped></style>
