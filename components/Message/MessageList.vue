<template>
  <div>
    <v-progress-circular
      v-if="loading"
      :size="70"
      :width="3"
      color="purple"
      indeterminate
      class="loading-message"
    ></v-progress-circular>
    <div v-if="messages.length">
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
    <div v-else-if="!loading" class="text-center">
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

    <v-dialog width="500" v-model="removeDialog">
      <v-card rounded="lg">
        <v-card-title>
          <v-spacer />
          {{ $t('Who do you want to remove this message for?') }}
          <v-spacer />
          <v-btn icon class="grey lighten-3" @click="onCancel">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider />
        <v-container fluid>
          <v-radio-group v-model="removeSelect">
            <v-radio value="Google">
              <template v-slot:label>
                <div>
                  {{ $t('UnsentFor') }}
                  <strong class="success--text">{{ $t('Everyone') }}</strong>
                </div>
              </template>
            </v-radio>
            <v-radio value="Duckduckgo">
              <template v-slot:label>
                <div>
                  {{ $t('RemoveFor') }}
                  <strong class="primary--text">{{ $t('You') }}</strong>
                </div>
              </template>
            </v-radio>
          </v-radio-group>
        </v-container>
        <v-divider />
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text class="primary--text text-capitalize" @click="onCancel">
            {{ $t('Cancel') }}
          </v-btn>
          <v-btn
            class="primary text-capitalize"
            @click="onAcceptDeleteMessage"
            :disabled="!removeSelect"
          >
            {{ $t('Remove') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog width="500" v-model="reverseDialog">
      <v-card rounded="lg">
        <v-card-title>
          <v-spacer />
          <v-btn icon class="grey lighten-3" @click="onCancel">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider />
        <v-container fluid>
          {{ $t('Do you want to reverse this message?') }}
        </v-container>
        <v-divider />
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text class="primary--text text-capitalize" @click="onCancel">
            {{ $t('Cancel') }}
          </v-btn>
          <v-btn
            class="primary text-capitalize"
            @click="onAcceptReverseMessage"
          >
            {{ $t('Reverse') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  props: ['loading'],
  data() {
    return {
      removeDialog: false,
      reverseDialog: false,
      removeSelect: null,
      dialog: true,
      index: null,
      id: null
    }
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
    onDeleteMessage(messageIndex, messageId) {
      this.removeDialog = true
      this.index = messageIndex
      this.id = messageId
    },
    onReverseMessage(messageIndex, messageId) {
      this.reverseDialog = true
      this.index = messageIndex
      this.id = messageId
    },
    onCancel() {
      this.removeDialog = this.reverseDialog = false
      this.index = this.id = null
    },
    async onAcceptDeleteMessage() {
      if (!this.id || !this.index) return
      this.removeDialog = false
      try {
        await this.deleteMessage({
          messageIndex: this.index,
          messageId: this.id
        })
      } catch (err) {
        this.$nuxt.error(err)
      }
      this.index = this.id = null
    },
    async onAcceptReverseMessage() {
      if (!this.id || !this.index) return
      this.reverseDialog = false
      try {
        await this.reverseMessage({
          messageIndex: this.index,
          messageId: this.id
        })
      } catch (err) {
        this.$nuxt.error(err)
      }
      this.index = this.id = null
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
<style lang="scss" scoped>
.loading-message {
  position: absolute;
  height: 100px;
  z-index: 2;
  left: 50%;
  transform: translateX(-50%);
}
</style>
