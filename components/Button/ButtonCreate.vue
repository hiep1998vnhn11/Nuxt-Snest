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
          :class="`${classes} text-capitalize`"
          @click="expand = true"
        >
          <v-icon v-bind="attrs" v-on="on">mdi-plus</v-icon>
        </v-btn>
      </template>
      <span>{{ $t('common.create') }}</span>
      <post-create-dialog
        :dialog="dialog"
        @close-dialog="dialog = false"
      ></post-create-dialog>
    </v-tooltip>
    <div class="show-create-app-bar">
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
          <v-card-title class="font-weight-bold"> Create </v-card-title>
          <v-container class="mt-n5">
            <v-btn
              text
              class="text-capitalize text-body rounded-md mt-2"
              large
              block
              @click="dialog = true"
            >
              <v-avatar
                outlined
                icon
                size="40"
                class="grey lighten-3 avatar-outlined left-15"
              >
                <v-icon>mdi-pencil-box</v-icon>
              </v-avatar>
              <div class="text-left font-weight-bold">
                Post
                <div class="text-caption">Create a post to your feed</div>
              </div>
              <v-spacer></v-spacer>
            </v-btn>

            <v-btn
              text
              class="text-capitalize text-body rounded-md mt-2"
              large
              block
              @click="dialog = true"
            >
              <v-avatar
                outlined
                icon
                size="40"
                class="grey lighten-3 avatar-outlined left-15"
              >
                <v-icon>mdi-flag-minus</v-icon>
              </v-avatar>
              <div class="text-left font-weight-bold">
                Page
                <div class="text-caption">
                  Connect and share with other people
                </div>
              </div>
              <v-spacer></v-spacer>
            </v-btn>
            <v-btn
              text
              class="text-capitalize text-body rounded-md mt-2"
              large
              block
              @click="dialog = true"
            >
              <v-avatar
                outlined
                icon
                size="40"
                class="grey lighten-3 avatar-outlined left-15"
              >
                <v-icon>mdi-account-group</v-icon>
              </v-avatar>
              <div class="text-left font-weight-bold">
                Group
                <div class="text-caption">
                  Connect with people with common interest
                </div>
              </div>
              <v-spacer></v-spacer>
            </v-btn>
          </v-container>
        </v-card>
      </v-expand-transition>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      expand: false,
      dialog: false
    }
  },
  computed: {
    classes() {
      return this.expand ? 'primary--text blue lighten-4' : null
    },
    ...mapGetters('user', ['currentUser'])
  },
  methods: {
    onClickOutsideWithConditional() {
      this.expand = false
    },
    closeConditional(e) {
      return this.expand
    }
  }
}
</script>

<style>
.show-create-app-bar {
  position: absolute;
  z-index: 900;
  right: 0.5rem;
  top: 64px;
}
</style>
