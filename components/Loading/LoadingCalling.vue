<template>
  <transition name="slide-fade">
    <div
      v-if="
        !$route.name.includes('call-call_id') &&
          calling &&
          callingStatus &&
          callingStatus !== 'answering'
      "
      class="call-group-notification"
    >
      <v-img
        width="100%"
        max-height="300px"
        style="border-radius: 20px;"
        :src="calling.user.profile_photo_path"
      />

      <div class="call-group-after">
        <v-tooltip top v-if="callingStatus === 'calling'">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              class="call-action-refuse danger"
              icon
              small
              v-bind="attrs"
              v-on="on"
              @click="onRefuseCalling"
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
            <img :src="calling.user.profile_photo_path" />
          </v-avatar>
          <div class="white--text">
            <strong>{{ calling.user.name }}</strong>
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
          <v-tooltip top v-if="callingStatus === 'calling'">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                v-bind="attrs"
                v-on="on"
                icon
                x-large
                class="success mx-3"
                @click="onAnswerCalling"
              >
                <v-icon>mdi-phone</v-icon>
              </v-btn>
            </template>
            <span>{{ $t('Answer') }}</span>
          </v-tooltip>

          <v-tooltip top v-else>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                v-bind="attrs"
                v-on="on"
                @click="onRefuseCalling"
                icon
                x-large
                class="danger mx-3"
              >
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </template>
            <span>{{ $t('Close') }}</span>
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
  </transition>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {}
  },
  methods: {
    onAnswerCalling() {
      this.$store.commit('message/SET_CALLING_STATUS', 'answering')
      this.$router.push(
        this.localePath({
          name: 'call-call_id',
          params: { call_id: this.calling.call_id }
        })
      )
    },
    onRefuseCalling() {
      this.$store.commit('message/SET_CALLING_USER', null)
      this.$store.commit('message/SET_CALLING_STATUS', 'refused')
      if (this.calling) {
        window.socket.emit('refuse-call', {
          call_id: this.calling.call_id,
          user_id: this.calling.user.id
        })
      }
    }
  },
  computed: {
    ...mapGetters('message', ['calling', 'callingStatus']),
    ...mapGetters('user', ['currentUser'])
  }
}
</script>
<style lang="scss" scoped>
.calling-container {
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: 200;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.2);
}
</style>
