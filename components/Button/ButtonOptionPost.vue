<template>
  <div>
    <v-tooltip bottom>
      <template v-slot:activator="{ on, attrs }">
        <v-btn @click="expand = true" icon text :class="`ml-2 ${classes}`">
          <v-icon v-bind="attrs" v-on="on">mdi-dots-horizontal</v-icon>
        </v-btn>
      </template>
      <span>{{ $t('common.option') }}</span>
    </v-tooltip>

    <v-dialog persistent v-model="dialog" width="600">
      <v-card>
        <div v-if="error">
          <v-card-title class="font-weight-bold">
            <v-btn icon large class="grey lighten-3" @click="error = false">
              <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
            <v-spacer />
            Have an error?
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
            Contribute to the new version
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
            Send a feedback to SNESt
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
              <v-avatar
                outlined
                icon
                class="grey lighten-3 avatar-outlined left-8"
              >
                <v-icon>mdi-message-alert</v-icon>
              </v-avatar>
              <div class="text-left">
                Contribute to the new version
                <div class="text-caption">
                  Contribute to the new version of this application
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
              <v-avatar
                outlined
                icon
                class="grey lighten-3 avatar-outlined left-8"
              >
                <v-icon>mdi-message-alert</v-icon>
              </v-avatar>
              <div class="text-left">
                Have an error?
                <div class="text-caption">Please tell us about this error</div>
              </div>
              <v-spacer></v-spacer>
            </v-btn>
          </v-container>
        </div>
      </v-card>
    </v-dialog>

    <div class="show-setting-app-bar">
      <v-expand-transition top>
        <v-card
          v-click-outside="{
            handler: onClickOutsideWithConditional,
            closeConditional
          }"
          v-show="expand"
          width="350"
          class="mx-auto"
        >
          <v-container>
            <v-btn
              text
              class="text-capitalize text-h6 font-weight-bold rounded-md mb-2"
              height="75"
              block
              active-class="blue lighten-3"
              :to="
                localePath({
                  name: 'user-url',
                  params: { url: post.user.url }
                })
              "
              v-if="!owned"
            >
              <v-avatar class="left-8 avatar-outlined" size="60">
                <img :src="post.user.profile_photo_path" />
              </v-avatar>
              <div class="text-left">
                {{ post.user.name }}
                <div class="text-caption">
                  Go to {{ post.user.name }} profile
                </div>
              </div>
              <v-spacer></v-spacer>
            </v-btn>
            <v-divider v-if="!owned" />

            <v-btn
              text
              class="text-capitalize rounded-md mt-2 mb-2"
              large
              block
              active-class="blue lighten-3"
              @click="dialog = true"
            >
              <v-avatar
                outlined
                icon
                size="40"
                class="grey lighten-3 avatar-outlined left-15"
              >
                <v-icon size="30">mdi-bookmark-plus-outline</v-icon>
              </v-avatar>
              <div class="text-left">
                Save this post
                <div class="text-caption">Save to your saved post list</div>
              </div>
              <v-spacer></v-spacer>
            </v-btn>
            <v-divider />

            <v-btn
              text
              class="text-capitalize rounded-md mt-2 mb-2"
              large
              block
              active-class="blue lighten-3"
              @click="dialog = true"
            >
              <v-avatar
                outlined
                icon
                size="40"
                class="grey lighten-3 avatar-outlined left-15"
              >
                <v-icon size="30">mdi-pencil-circle-outline</v-icon>
              </v-avatar>
              <div class="text-left">See edit history</div>
              <v-spacer />
            </v-btn>

            <v-btn
              text
              class="text-capitalize rounded-md mt-2"
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
                class="grey lighten-3 avatar-outlined left-15"
              >
                <v-icon>mdi-code-tags</v-icon>
              </v-avatar>
              Embed this post
              <v-spacer></v-spacer>
            </v-btn>
            <v-divider />

            <v-btn
              text
              class="text-capitalize text-body rounded-md mt-2"
              large
              block
              active-class="blue lighten-3"
              @click="deleteDialog = true"
              v-if="owned"
            >
              <v-avatar
                outlined
                icon
                size="40"
                class="grey lighten-3 avatar-outlined left-15"
              >
                <v-icon>mdi-trash-can-outline</v-icon>
              </v-avatar>
              {{ $t('Delete this post') }}
              <v-spacer></v-spacer>
            </v-btn>

            <v-btn
              text
              class="text-capitalize text-body rounded-md mt-2"
              large
              block
              active-class="blue lighten-3"
              @click="editDialog = true"
              v-if="owned"
            >
              <v-avatar
                outlined
                icon
                size="40"
                class="grey lighten-3 avatar-outlined left-15"
              >
                <v-icon>mdi-pencil-outline</v-icon>
              </v-avatar>
              Edit this post now
              <v-spacer></v-spacer>
            </v-btn>

            <v-btn
              text
              class="text-capitalize text-body rounded-md mt-2"
              large
              block
              active-class="blue lighten-3"
              @click="dialog = true"
              v-if="owned"
            >
              <v-avatar
                outlined
                icon
                size="40"
                class="grey lighten-3 avatar-outlined left-15"
              >
                <v-icon>mdi-earth</v-icon>
              </v-avatar>
              Edit privacy
              <v-spacer></v-spacer>
            </v-btn>

            <v-btn
              text
              class="text-capitalize text-body rounded-md mt-2"
              large
              block
              v-if="!owned"
            >
              <v-avatar
                outlined
                icon
                size="40"
                class="grey lighten-3 avatar-outlined left-15"
              >
                <v-icon>mdi-message-alert-outline</v-icon>
              </v-avatar>
              Report this post
              <v-spacer></v-spacer>
            </v-btn>
          </v-container>
        </v-card>
      </v-expand-transition>
    </div>

    <post-edit
      :dialog="editDialog"
      @close-dialog="editDialog = false"
      :post="post"
    />

    <v-dialog width="500" v-model="deleteDialog">
      <v-card>
        <v-card-title>
          <v-spacer />
          {{ $t('Delete post') }}
          <v-spacer />
          <v-btn icon class="grey lighten-3" text @click="deleteDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-container>
          {{ $t('Are you sure to delete this post?') }}
        </v-container>
        <v-card-actions>
          <v-spacer />
          <v-btn class="text-capitalize red--text" text @click="onDeletePost">
            Delete
          </v-btn>
          <v-btn class="text-capitalize" text @click="deleteDialog = false">
            Cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  props: ['post'],
  methods: {
    ...mapActions('user', ['getUser']),
    ...mapActions('post', ['deletePost']),
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
    async onDeletePost() {
      this.deleteDialog = false
      try {
        await this.deletePost(this.post.id)
      } catch (err) {
        this.error = err.response.data.message
      }
    }
  },
  computed: {
    classes() {
      return this.expand ? 'primary--text blue lighten-4' : null
    },
    owned() {
      return this.currentUser.id === this.post.user_id
    },
    ...mapGetters('user', ['currentUser'])
  },
  data() {
    return {
      expand: false,
      dialog: false,
      error: false,
      feedback: false,
      editDialog: false,
      deleteDialog: false
    }
  }
}
</script>

<style scoped>
.show-setting-app-bar {
  position: absolute;
  z-index: 3;
  right: 0.5rem;
  top: 64px;
}

.left-8 {
  left: -8px;
}
.left-15 {
  left: -15px;
}
</style>
