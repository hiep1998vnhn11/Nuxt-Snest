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
          exact
          :loading="loading"
          :class="`mx-1 ${classes}`"
          @click="onClickButton"
        >
          <v-icon v-bind="attrs" v-on="on">mdi-facebook-messenger</v-icon>
        </v-btn>
      </template>
      <span>{{ $t('common.message') }}</span>
    </v-tooltip>
    <div class="show-message-app-bar">
      <v-expand-transition bottom>
        <v-card
          v-show="expand"
          v-click-outside="{
            handler: onClickOutsideWithConditional,
            closeConditional
          }"
          width="21rem"
          max-height="600"
          class="mx-auto scroll-y rounded-lg"
        >
          <v-toolbar tile class="elevation-0 font-weight-black text-h5">
            Message
            <v-spacer />
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  v-bind="attrs"
                  icon
                  small
                  v-on="on"
                  @click="optionExpand = !optionExpand"
                >
                  <v-icon>mdi-dots-horizontal</v-icon>
                </v-btn>
              </template>
              <span>{{ $t('common.option') }}</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  v-bind="attrs"
                  icon
                  small
                  class="ml-3"
                  to="/messages"
                  v-on="on"
                  @click="cancelExpand"
                >
                  <v-icon>mdi-arrow-expand-all</v-icon>
                </v-btn>
              </template>
              <span>Open all in message page</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn v-bind="attrs" icon small class="ml-3 mr-1" v-on="on">
                  <v-icon>mdi-pencil-box-outline</v-icon>
                </v-btn>
              </template>
              <span>New message</span>
            </v-tooltip>
          </v-toolbar>
          <v-toolbar class="elevation-0">
            <v-text-field
              v-model="search"
              rounded
              class="grey lighten-3"
              label="Search"
              single-line
              hide-details
              large
            >
              <template v-slot:prepend-inner>
                <v-icon class="ml-n4">mdi-magnify</v-icon>
              </template>
            </v-text-field>
          </v-toolbar>
          <v-card-text class="pa-1">
            <message-list-thresh :loading="loading" />
          </v-card-text>
        </v-card>
      </v-expand-transition>
      <div class="show-message-option">
        <v-expand-transition>
          <v-card v-show="optionExpand" width="350">
            <v-list-item two-line>
              <v-list-item-content>
                <v-list-item-title class="font-weight-bold">
                  Setting chat
                </v-list-item-title>
                <v-list-item-subtitle class="text-caption">
                  Customize your messenger experience and display
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-container>
              <v-divider />

              <v-btn text block class="text-capitalize mt-2" large>
                <v-icon class="ml-n2 mr-2">mdi-phone-incoming-outline</v-icon>
                incoming call audio
                <v-spacer />
                <v-switch class="mt-6 mr-n4" inset></v-switch>
              </v-btn>

              <v-btn text block class="text-capitalize" large>
                <v-icon class="ml-n2 mr-2">mdi-volume-low</v-icon>
                message notification sound
                <v-spacer />
                <v-switch class="mt-6 mr-n4" inset></v-switch>
              </v-btn>
              <v-btn text block class="text-capitalize" large>
                <v-icon class="ml-n2 mr-2">
                  mdi-checkbox-multiple-blank-circle-outline
                </v-icon>
                <div class="text-left">
                  Post
                  <div class="text-caption">Create a post to your feed</div>
                </div>
                <v-spacer />
                <v-switch class="mt-6 mr-n4" inset></v-switch>
              </v-btn>
              <v-divider />
              <v-btn text block class="text-capitalize" large>
                <v-icon class="ml-n2 mr-2">mdi-vector-circle-variant</v-icon>
                turn off active status
                <v-spacer />
                <v-switch class="mt-6 mr-n4" inset></v-switch>
              </v-btn>
              <v-btn text block class="text-capitalize" large>
                <v-icon class="ml-n2 mr-2">mdi-alert-circle-outline</v-icon>
                blocking setting
                <v-spacer />
                <v-switch class="mt-6 mr-n4" inset></v-switch>
              </v-btn>
            </v-container>
          </v-card>
        </v-expand-transition>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  data() {
    return {
      expand: false,
      optionExpand: false,
      search: '',
      loading: false,
      error: null
    }
  },
  computed: {
    classes() {
      return this.expand ? 'primary--text blue lighten-4' : null
    },
    ...mapGetters('thresh', ['threshes'])
  },
  methods: {
    ...mapActions('thresh', ['getThreshes', 'setThreshPage']),
    async fetchThresh() {
      if (this.threshes.length) return
      this.loading = true
      this.error = null
      try {
        await this.getThreshes()
      } catch (err) {
        this.error = err.response.data.message
      }
      this.loading = false
    },
    onClickOutsideWithConditional() {
      this.expand = false
      this.optionExpand = false
    },
    closeConditional(e) {
      return this.expand
    },
    cancelExpand() {
      this.expand = false
      this.optionExpand = false
    },
    onClickButton() {
      if (!this.expand) this.fetchThresh()
      this.expand = !this.expand
    }
  }
}
</script>

<style>
.show-message-app-bar {
  position: absolute;
  z-index: 900;
  right: 0.5rem;
  top: 64px;
}

.title-message-expand {
  position: fixed;
  z-index: 100;
}

.show-message-option {
  position: absolute;
  z-index: 101;
  top: 70px;
  right: 100px;
}

.scroll-y {
  overflow-y: auto;
  z-index: 100;
}

.scroll-y::-webkit-scrollbar {
  width: 0.25rem;
}

.scroll-y::-webkit-scrollbar-track {
  background: white;
}

.scroll-y::-webkit-scrollbar-thumb {
  background: #0077ff;
}
</style>
