<template>
  <v-dialog
    scrollable
    persistent
    v-model="dialog"
    hide-overlay
    max-width="800px"
  >
    <v-card
      v-click-outside="{
        handler: onClickOutsideWithConditional,
        closeConditional
      }"
      crollable
      class="overflow-hidden"
    >
      <v-card-title>
        <v-btn icon @click="$emit('close-dialog')">
          <v-icon color="dark">mdi-close</v-icon>
        </v-btn>
        <v-spacer></v-spacer>
        Comment to this post ...
        <v-spacer></v-spacer>
      </v-card-title>
      <v-divider></v-divider>

      <v-container id="scrolling-techniques-6" v-if="!comments">
        <v-skeleton-loader
          v-if="loading"
          type="list-item-avatar, list-item-avatar, list-item-avatar"
        ></v-skeleton-loader>
        <div v-if="error">
          Not found components
          {{ error }}
        </div>
      </v-container>
      <v-card-text v-if="comments">
        <v-row
          justify="space-around"
          v-for="comment in comments"
          :key="comment.id"
        >
          <v-col cols="1">
            <nuxt-link
              :to="
                localePath({
                  name: 'user-url',
                  params: { url: comment.user.url }
                })
              "
              v-slot="{ href, navigate }"
            >
              <v-avatar class="avatar-outlined" size="40">
                <img
                  :src="comment.user.profile_photo_path"
                  :alt="comment.user.name"
                  @click="navigate"
                  :href="href"
                />
              </v-avatar>
            </nuxt-link>
          </v-col>
          <v-col cols="11">
            <v-card class="rounded-lg text-body-1 pl-2 py-1">
              <base-name-link :user="comment.user"></base-name-link>
              {{ comment.content }}
            </v-card>
            <div class="text-caption">
              <v-btn
                @click="showId = comment.id"
                class="text-capitalize"
                text
                :ripple="false"
                x-small
              >
                like
              </v-btn>
              <v-btn
                @click="showId = comment.id"
                class="text-capitalize"
                text
                :ripple="false"
                x-small
              >
                Answer
              </v-btn>
              {{ comment.updated_at | relativeTime }}
            </div>
            <div v-if="comment.sub_comments_count">
              <v-row v-show="comment.id !== showId">
                <v-btn
                  text
                  class="text-capitalize primary--text"
                  small
                  block
                  @click="showId = comment.id"
                >
                  Show {{ comment.sub_comments_count }} sub comment
                  <v-spacer></v-spacer>
                </v-btn>
              </v-row>
              <v-row
                justify="space-around"
                v-for="sub_comment in comment.sub_comments"
                :key="sub_comment.id"
                v-show="comment.id === showId"
              >
                <v-col cols="1">
                  <nuxt-link
                    :to="
                      localePath({
                        name: 'user-url',
                        params: { url: sub_comment.user.url }
                      })
                    "
                    v-slot="{ href, navigate }"
                    class="ml-5"
                  >
                    <v-avatar class="avatar-outlined" size="30">
                      <img
                        :src="comment.user.profile_photo_path"
                        :alt="sub_comment.user.name"
                        @click="navigate"
                        :href="href"
                      />
                    </v-avatar>
                  </nuxt-link>
                </v-col>
                <v-col cols="11">
                  <v-card class="rounded-lg pl-2">
                    <base-name-link :user="sub_comment.user"></base-name-link>
                    {{ sub_comment.content }}
                  </v-card>
                  <div class="text-caption ml-3">
                    {{ sub_comment.created_at | relativeTime }}
                  </div>
                </v-col>
              </v-row>
            </div>
            <v-alert
              :value="createSubError"
              transition="scale-transition"
              type="error"
              height="50"
            >
              Something went wrong. Please try again
            </v-alert>
            <div v-if="showId === comment.id">
              <v-app-bar color="white" elevation="0" bottom v-if="isLoggedIn">
                <v-avatar class="avatar-outlined mr-4" size="30">
                  <img
                    :src="currentUser.profile_photo_path"
                    :alt="currentUser.name"
                  />
                </v-avatar>
                <v-text-field
                  clearable
                  :label="$t('create_post.content')"
                  v-model="subComment"
                  append-icon="mdi-file-image-outline"
                  @click:append="upload"
                  class="mt-8"
                  :loading="loadingSubCreate"
                >
                </v-text-field>

                <v-btn
                  class="ml-3"
                  small
                  icon
                  text
                  outlined
                  @click="onSubComment(comment)"
                >
                  <v-icon size="15">mdi-send</v-icon>
                </v-btn>
              </v-app-bar>
            </div>
          </v-col>
        </v-row>
        <v-alert
          :value="createError"
          transition="scale-transition"
          type="error"
          height="50"
        >
          Something went wrong. Please try again
        </v-alert>
      </v-card-text>
      <v-card-actions>
        <v-app-bar bottom v-if="isLoggedIn">
          <v-avatar class="avatar-outlined mr-4" size="40">
            <img
              :src="currentUser.profile_photo_path"
              :alt="currentUser.name"
            />
          </v-avatar>
          <v-text-field
            clearable
            :label="$t('create_post.content')"
            v-model="comment"
            append-icon="mdi-file-image-outline"
            @click:append="upload"
            class="mt-8"
            :loading="loadingCreate"
          >
          </v-text-field>

          <v-btn class="ml-3" icon text outlined @click="onComment">
            <v-icon>mdi-send</v-icon>
          </v-btn>
        </v-app-bar>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import axios from 'axios'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      comments: null,
      comment: '',
      notFound: false,
      collapseOnScroll: true,
      error: null,
      loading: false,
      loadingCreate: false,
      createError: false,
      createSubError: false,
      loadingSubCreate: false,
      showId: 0,
      write: false,
      subComment: ''
    }
  },
  props: ['dialog', 'post_id'],
  computed: mapGetters('user', ['isLoggedIn', 'currentUser']),
  methods: {
    async getComment() {
      if (this.dialog) {
        this.comments = this.error = null
        this.loading = true
        try {
          const response = await axios.get(
            `/v1/user/post/${this.post_id}/get_comment`
          )
          this.loading = false
          this.comments = response.data.data
        } catch (err) {
          console.log(err)
          this.loading = false
          this.error = err.toString()
        }
      }
    },
    async onComment() {
      if (this.comment) {
        this.loadingCreate = true
        try {
          let url = `/v1/user/post/${this.post_id}/create_comment`
          let response = await axios.post(url, {
            content: this.comment
          })
          const currentComment = response.data.data
          Object.assign(currentComment, {
            user: {
              url: this.currentUser.url,
              profile_photo_path: this.currentUser.profile_photo_path,
              name: this.currentUser.name
            },
            sub_comments_count: 0
          })
          this.comments.push(currentComment)
          this.comments_count += 1
          this.comment = ''
        } catch (err) {
          this.createError = true
        }
        this.loadingCreate = false
      }
    },
    async onSubComment(comment) {
      if (this.subComment) {
        this.loadingSubCreate = true
        try {
          let url = `/v1/user/post/comment/${comment.id}/create_sub_comment`
          let response = await axios.post(url, {
            content: this.subComment
          })
          const currentComment = response.data.data
          const index = this.comments.indexOf(comment)
          Object.assign(currentComment, {
            user: {
              url: this.currentUser.url,
              profile_photo_path: this.currentUser.profile_photo_path,
              name: this.currentUser.name
            }
          })
          this.comments[index].sub_comments.push(currentComment)
          this.comments_count += 1
          this.subComment = ''
        } catch (err) {
          console.log(err)
          this.createSubError = true
        }
        this.loadingSubCreate = false
      }
    },
    closeError() {
      const _this = this
      if (this.createError || this.createSubError) {
        setTimeout(function() {
          _this.createError = false
          _this.createSubError = false
        }, 4000)
      }
    },
    onClickOutsideWithConditional() {
      this.$emit('close-dialog')
    },
    closeConditional(e) {
      return this.dialog
    },
    upload() {
      this.comment = ''
      console.log(this.$vuetify.application)
    }
  },
  created() {
    this.getComment()
  },
  watch: {
    dialog: 'getComment',
    createError: 'closeError',
    createSubError: 'closeError'
  }
}
</script>

<style scoped>
.avatar-outlined {
  border: thin solid rgba(0, 0, 0, 0.12) !important;
}

.fixed {
  position: fixed;
  z-index: 999;
  left: 50%;
}

.relative {
  position: relative;
}

.absolute {
  position: absolute;
}
</style>
