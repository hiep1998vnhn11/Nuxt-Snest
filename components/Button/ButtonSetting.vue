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
          @click="expand = true"
        >
          <v-icon v-bind="attrs" v-on="on">mdi-menu-down</v-icon>
        </v-btn>
      </template>
      <span>{{ $t('common.option') }}</span>
    </v-tooltip>
    <v-dialog v-model="dialog" persistent width="600">
      <v-card>
        <div v-if="error">
          <v-card-title class="font-weight-bold">
            <v-btn icon large class="grey lighten-3" @click="error = false">
              <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
            <v-spacer />
            {{ $t('Have an error?') }}
            <v-spacer />
            <v-btn icon large class="grey lighten-3" @click="closeError">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-divider />
          <v-container> Hello </v-container>
        </div>

        <div v-else-if="feedback">
          <v-card-title class="font-weight-bold">
            <v-btn icon large class="grey lighten-3" @click="feedback = false">
              <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
            <v-spacer />
            {{ $t('Contribute to the new version') }}
            <v-spacer />
            <v-btn icon large class="grey lighten-3" @click="closeFeedback">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-divider />
        </div>
        <div v-else>
          <v-card-title class="font-weight-bold">
            <v-spacer />
            {{ $t('Send a feedback to SNESt') }}
            <v-spacer />
            <v-btn icon large class="grey lighten-3" @click="dialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-divider />

          <v-container>
            <v-btn
              text
              class="text-capitalize text-body font-weight-bold rounded-md"
              height="75"
              block
              active-class="blue lighten-3"
              @click="feedback = true"
            >
              <v-avatar outlined icon class="avatar-outlined left-8">
                <v-icon>mdi-message-alert</v-icon>
              </v-avatar>
              <div class="text-left">
                {{ $t('Contribute to the new version') }}
                <div class="text-caption">
                  {{ $t('Contribute to the new version of this application') }}
                </div>
              </div>
              <v-spacer></v-spacer>
            </v-btn>
            <v-btn
              text
              class="text-capitalize text-body font-weight-bold rounded-md mt-2"
              height="75"
              block
              active-class="blue lighten-3"
              @click="error = true"
            >
              <v-avatar outlined icon class="avatar-outlined left-8">
                <v-icon>mdi-message-alert</v-icon>
              </v-avatar>
              <div class="text-left">
                {{ $t('Have an error?') }}
                <div class="text-caption">
                  {{ $t('Please tell us about this error') }}
                </div>
              </div>
              <v-spacer></v-spacer>
            </v-btn>
          </v-container>
        </div>
      </v-card>
    </v-dialog>
    <div class="show-setting-app-bar">
      <v-expand-transition right>
        <v-card
          v-show="expand"
          v-click-outside="{
            handler: onClickOutsideWithConditional,
            closeConditional
          }"
          width="21rem"
          class="mx-auto"
        >
          <v-container>
            <v-btn
              v-if="!!currentUser"
              text
              class="rounded-md mb-2"
              height="75"
              block
              active-class="primary--text"
              :to="
                localePath({
                  name: 'index-user-url',
                  params: { url: currentUser.url }
                })
              "
            >
              <v-avatar class="mr-3 avatar-outlined" size="60">
                <img :src="currentUser.profile_photo_path" />
              </v-avatar>
              <div class="text-left text-capitalize text-h5 font-weight-bold">
                {{ currentUser.name }}
                <div class="text-none text-caption">Go to your profile</div>
              </div>
              <v-spacer></v-spacer>
            </v-btn>
            <v-divider></v-divider>
            <v-btn
              text
              class="text-capitalize text-body font-weight-bold rounded-md mt-2 mb-2"
              large
              block
              active-class="blue lighten-3"
              @click="dialog = true"
            >
              <v-avatar
                outlined
                icon
                size="40"
                class="avatar-outlined ml-n3 mr-3"
              >
                <v-icon>mdi-message-alert</v-icon>
              </v-avatar>
              <div class="text-left">
                {{ $t('Send a feedback') }}
                <div class="text-caption">
                  {{ $t('Contribute to improving this application') }}
                </div>
              </div>
              <v-spacer></v-spacer>
            </v-btn>

            <v-btn
              text
              class="text-capitalize text-body rounded-md mt-2"
              large
              block
              exact
              active-class="blue lighten-3"
              :to="localePath({ name: 'setting-account' })"
            >
              <v-avatar
                outlined
                icon
                size="40"
                class="avatar-outlined  ml-n3 mr-3"
              >
                <v-icon>mdi-cog</v-icon>
              </v-avatar>
              Setting and privacy
              <v-spacer></v-spacer>
            </v-btn>

            <v-btn
              text
              class="text-capitalize text-body rounded-md mt-2"
              large
              block
              active-class="blue lighten-3"
              @click="dialog = true"
            >
              <v-avatar
                outlined
                icon
                size="40"
                class="avatar-outlined  ml-n3 mr-3"
              >
                <v-icon>mdi-progress-question</v-icon>
              </v-avatar>
              help and support
              <v-spacer></v-spacer>
            </v-btn>

            <v-btn
              text
              class="text-capitalize text-body rounded-md mt-2"
              large
              block
              active-class="blue lighten-3"
              @click="dialog = true"
            >
              <v-avatar
                outlined
                icon
                size="40"
                class="avatar-outlined  ml-n3 mr-3"
              >
                <v-icon>mdi-moon-waning-crescent</v-icon>
              </v-avatar>
              {{ $t('Display') }}
              <v-spacer></v-spacer>
            </v-btn>

            <v-btn
              text
              class="text-capitalize text-body rounded-md mt-2"
              large
              block
              @click="onLogout"
            >
              <v-avatar
                outlined
                icon
                size="40"
                class="avatar-outlined ml-n3 mr-3"
              >
                <v-icon>mdi-logout</v-icon>
              </v-avatar>
              {{ $t('Logout') }}
              <v-spacer></v-spacer>
            </v-btn>
          </v-container>
        </v-card>
      </v-expand-transition>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  data() {
    return {
      expand: false,
      dialog: false,
      error: false,
      feedback: false
    }
  },
  computed: {
    classes() {
      return this.expand ? 'primary--text blue lighten-4' : null
    },
    ...mapGetters('user', ['currentUser'])
  },
  methods: {
    ...mapActions('user', ['logout', 'getUser']),
    ...mapActions(['clearAllState']),
    onClickOutsideWithConditional() {
      this.expand = false
    },
    closeConditional(e) {
      return this.expand
    },
    closeFeedback() {
      this.dialog = false
      this.feedback = false
    },
    closeError() {
      this.dialog = false
      this.feedback = false
    },
    async onLogout() {
      await this.logout()
      this.clearAllState()
      window.socket.disconnect()
      this.$router.push('/login')
    }
  }
}
</script>

<style>
.show-setting-app-bar {
  position: absolute;
  z-index: 900;
  right: 0.5rem;
  top: 64px;
}
</style>
