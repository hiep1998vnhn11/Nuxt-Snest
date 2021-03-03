<template>
  <v-card class="mx-auto rounded-lg">
    <v-list-item>
      <nuxt-link
        :to="localePath({ name: 'user-url', params: { url: post.user.url } })"
        v-slot="{ href, navigate }"
      >
        <v-list-item-avatar class="avatar-outlined" color="grey">
          <img
            :src="post.user.profile_photo_path"
            :alt="post.user.name"
            @click="navigate"
            :href="href"
          />
        </v-list-item-avatar>
      </nuxt-link>
      <v-list-item-content>
        <v-list-item>
          <base-name-link :user="post.user" />
          <v-spacer></v-spacer>
        </v-list-item>
        <v-list-item-subtitle>
          {{ post.created_at | relativeTime }}
        </v-list-item-subtitle>
      </v-list-item-content>
      <button-option-post v-if="!!this.currentUser" :post="post" />
    </v-list-item>
    <v-container>
      {{ post.content }}
      <v-row v-if="post.images.length" class="pa-5">
        <v-img
          class="ma-1"
          width="50%"
          v-for="image in post.images"
          :key="image.id"
          :src="image.path"
        ></v-img>
      </v-row>
    </v-container>
    <v-toolbar flat>
      <v-tooltip top class="text-body-1 white">
        <template color="grey" v-slot:activator="{ on, attrs }">
          <v-icon color="primary" v-bind="attrs" v-on="on" class="ml-7">
            mdi-heart
          </v-icon>
        </template>
        <v-card max-width="300" class="text-body1">{{ post.likes }}</v-card>
      </v-tooltip>
      <span>
        {{ post.likes_count }}
      </span>
      <v-spacer></v-spacer>
      <span class="mr-7">
        {{ post.comments_count }}
        {{ $t('count.comments') }}
      </span>
    </v-toolbar>
    <v-divider class="mx-4"></v-divider>
    <v-toolbar flat dense>
      <v-row no-gutters>
        <v-col cols="6">
          <v-btn class="text-body-1" text block @click="onLike" :ripple="false">
            <v-icon v-if="!post.isLiked">mdi-heart-outline</v-icon>
            <v-icon v-else color="primary">mdi-heart</v-icon>
            <span class="text-capitalize">{{ $t('action.like') }} </span>
          </v-btn>
        </v-col>
        <v-col cols="6">
          <v-btn
            class="text-capitalize"
            text
            block
            @click="showComment = true"
            :ripple="false"
          >
            <v-icon>mdi-comment-outline</v-icon>
            {{ $t('action.comment') }}
          </v-btn>
        </v-col>
      </v-row>
    </v-toolbar>
    <v-divider class="mx-4" />

    <v-container v-if="showComment">
      <v-skeleton-loader
        v-if="loading"
        type="list-item-avatar, list-item-avatar, list-item-avatar"
      ></v-skeleton-loader>
      <div v-else-if="comments">
        <v-row
          justify="space-around"
          v-for="comment in comments"
          :key="comment.id"
        >
          <div>
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
          </div>
          <v-col>
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
      </div>
    </v-container>
    <v-divider v-if="showComment" class="mx-4" />

    <v-toolbar v-if="isLoggedIn && currentUser" flat>
      <v-avatar class="avatar-outlined mr-4" size="40">
        <img :src="currentUser.profile_photo_path" :alt="currentUser.name" />
      </v-avatar>
      <v-text-field
        clearable
        rounded
        solo
        dense
        class="mt-8"
        :label="$t('WriteAComment')"
        v-model="comment"
        append-icon="mdi-file-image-outline"
        @click:append="upload"
        @keydown.enter="onComment"
        :loading="loadingCreate"
      >
      </v-text-field>

      <v-btn class="ml-3" icon text outlined @click="onComment">
        <v-icon>mdi-send</v-icon>
      </v-btn>
    </v-toolbar>

    <!-- delete dialog -->
    <v-dialog v-model="deleteDialog" max-width="290">
      <v-card>
        <v-card-title class="headline">Delete Post?</v-card-title>
        <v-card-text> Do you want to delete this post? </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="deleteDialog = false">
            Disagree
          </v-btn>
          <v-btn color="green darken-1" text @click="onDeletePost">
            Agree
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import axios from 'axios'
export default {
  props: ['post'],
  data: () => {
    return {
      showComment: false,
      writeComment: false,
      comment: '',
      deleteDialog: false,
      isLike: false,
      comments: null,
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
  computed: mapGetters('user', ['currentUser', 'isLoggedIn']),
  methods: {
    ...mapActions('post', ['deletePost', 'createPost']),
    async getComment() {
      if (this.showComment) {
        this.comments = this.error = null
        this.loading = true
        try {
          const response = await axios.get(
            `/v1/user/post/${this.post.id}/get_comment`
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
          let url = `/v1/user/post/${this.post.id}/create_comment`
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
    },
    openCommentDialog() {
      this.writeComment = true
    },
    closeCommentDialog() {
      this.writeComment = false
    },
    async onDeletePost() {
      await this.deletePost(this.post.id)
      this.$swal({
        icon: 'success',
        text: 'Delete post successfully!'
      })
      this.deleteDialog = false
    },
    async deleteComment() {
      let url = `/auth/user/post/${this.post.id}/12/delete`
      const response = await axios.post(url)
      this.$swal({
        icon: 'success',
        text: response.data.message
      })
    },
    async onLike() {
      if (!this.currentUser) {
        console.log('handleLike failed!')
        return
      }
      this.post.isLiked = !this.post.isLiked
      if (!this.post.isLiked) {
        this.post.likes_count -= 1
      } else this.post.likes_count += 1
      let url = `/v1/user/post/${this.post.id}/handle_like`
      await axios.post(url)
    }
  },
  watch: {
    createError: 'closeError',
    createSubError: 'closeError',
    showComment: 'getComment'
  }
}
</script>

<style scoped>
.avatar-outlined {
  border: thin solid rgba(0, 0, 0, 0.12) !important;
}

.z-index-4 {
  z-index: 4;
}

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
