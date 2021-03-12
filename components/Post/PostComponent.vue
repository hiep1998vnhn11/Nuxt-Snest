<template>
  <v-card :class="`mx-auto hover-up`" flat>
    <v-list-item>
      <v-list-item-avatar>
        <base-name-link image :user="post.user" />
      </v-list-item-avatar>
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

    <!-- post content -->
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

    <!-- post like and comment count -->
    <v-toolbar flat>
      <v-tooltip top max-width="200" min-width="200" offset-overflow>
        <template color="grey" v-slot:activator="{ on, attrs }">
          <v-btn
            class="text-capitalize rounded-lg"
            text
            @click="onLike"
            :ripple="false"
            outlined
            v-bind="attrs"
            v-on="on"
          >
            <v-icon v-if="!post.isLiked">mdi-heart-outline</v-icon>
            <v-icon v-else color="colorRed">mdi-heart</v-icon>
            <span class="ml-3">
              {{ post.likes_count }}
            </span>
          </v-btn>
        </template>
        {{ post.likes }}
      </v-tooltip>
      <v-btn
        class="text-capitalize rounded-lg ml-3 primary"
        outlined
        color="white"
        text
        @click="showComment = !showComment"
        :ripple="false"
      >
        <v-icon class="mr-3">mdi-comment-outline</v-icon>
        {{ post.comments_count }}
      </v-btn>
    </v-toolbar>

    <v-divider class="mx-4"></v-divider>

    <transition name="fade">
      <v-toolbar v-if="isLoggedIn && currentUser" flat rounded="lg">
        <v-avatar class="avatar-outlined mr-4" size="40">
          <img :src="currentUser.profile_photo_path" :alt="currentUser.name" />
        </v-avatar>
        <v-text-field
          background-color="grey lighten-3"
          dense
          flat
          hint
          autocomplete="off"
          hide-details
          rounded
          solo
          :label="$t('WriteAComment')"
          v-model="comment"
          append-icon="mdi-file-image-outline"
          @click:append="upload"
          @keydown.enter="onComment"
          :loading="loadingCreate"
          @focus="showComment = true"
        >
        </v-text-field>
        <v-btn
          class="ml-3 mr-0"
          width="40"
          height="40"
          icon
          text
          outlined
          @click="onComment"
        >
          <v-icon>mdi-send</v-icon>
        </v-btn>
      </v-toolbar>
    </transition>

    <v-expand-x-transition>
      <v-divider v-if="showComment" class="mx-4" />
    </v-expand-x-transition>

    <!-- post comments -->
    <v-expand-transition>
      <v-container v-if="showComment">
        <v-skeleton-loader
          v-if="loading"
          type="list-item-avatar, list-item-avatar, list-item-avatar"
        ></v-skeleton-loader>
        <div v-else-if="comments">
          <v-row
            justify="space-around"
            no-gutters
            v-for="(comment, index) in comments"
            :key="comment.id"
          >
            <div>
              <base-name-link image :user="comment.user" class="mr-2" />
            </div>
            <v-col>
              <v-card
                class="rounded-lg text-body-1 pl-2 py-1 elevation-0 grey lighten-4"
              >
                <v-row class="pa-3">
                  <base-name-link :user="comment.user"></base-name-link>
                </v-row>
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
              <!-- sub comment count -->
              <div v-if="comment.sub_comments_count">
                <a
                  v-show="comment.id !== showId"
                  class="text-caption"
                  @click="showId = comment.id"
                >
                  {{ comment.sub_comments_count }} {{ $t('Reply') }}
                </a>
                <v-row
                  justify="space-around"
                  no-gutters
                  v-for="sub_comment in comment.sub_comments"
                  :key="sub_comment.id"
                  v-show="comment.id === showId"
                >
                  <div>
                    <base-name-link
                      image
                      :user="sub_comment.user"
                      class="mr-2"
                    />
                  </div>
                  <v-col>
                    <v-card class="rounded-lg pl-2 elevation-0 grey lighten-4">
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
              <v-expand-transition>
                <div v-if="showId === comment.id">
                  <v-app-bar
                    color="white"
                    elevation="0"
                    bottom
                    v-if="isLoggedIn"
                  >
                    <v-avatar class="avatar-outlined mr-4" size="30">
                      <img
                        :src="currentUser.profile_photo_path"
                        :alt="currentUser.name"
                      />
                    </v-avatar>
                    <v-text-field
                      background-color="grey lighten-3"
                      dense
                      flat
                      hint
                      autocomplete="off"
                      hide-details
                      rounded
                      solo
                      height="30"
                      :label="$t('create_post.content')"
                      v-model="subComment"
                      append-icon="mdi-file-image-outline"
                      @click:append="upload"
                      @keydown.enter="onSubComment(comment, index)"
                      :loading="loadingSubCreate"
                    >
                    </v-text-field>
                    <v-btn
                      class="ml-3"
                      small
                      icon
                      text
                      outlined
                      @click="onSubComment(comment, index)"
                    >
                      <v-icon size="15">mdi-send</v-icon>
                    </v-btn>
                  </v-app-bar>
                </div>
              </v-expand-transition>
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
    </v-expand-transition>

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
import moment from 'moment'
export default {
  props: ['post', 'page'],
  data: () => {
    return {
      hover: false,
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
  computed: {
    ...mapGetters('user', ['currentUser', 'isLoggedIn'])
  },
  methods: {
    ...mapActions('post', ['deletePost', 'createPost']),
    async getComment() {
      this.comments = null
      if (this.showComment) {
        this.error = null
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
        const rawComment = {
          id: Math.random(),
          content: this.comment,
          created_at: moment.utc().format(),
          updated_at: moment.utc().format(),
          user: {
            id: this.currentUser,
            url: this.currentUser.url,
            profile_photo_path: this.currentUser.profile_photo_path,
            name: this.currentUser.name
          },
          sub_comments_count: 0,
          sub_comments: []
        }
        const indexRawComment = this.comments.length
        this.comments = [...this.comments, rawComment]
        if (this.page) {
          this.post.comments_count += 1
        } else {
          this.$emit('onComment')
        }
        try {
          let url = `/v1/user/post/${this.post.id}/create_comment`
          let response = await axios.post(url, {
            content: this.comment
          })
          this.comments[indexRawComment] = Object.assign(
            this.comments[indexRawComment],
            response.data.data
          )
        } catch (err) {
          this.createError = true
        }
        this.comment = ''
        this.loadingCreate = false
      }
    },
    async onSubComment(comment, index) {
      if (this.subComment) {
        const rawComment = {
          id: Math.random(),
          content: this.comment,
          created_at: moment.utc().format(),
          updated_at: moment.utc().format(),
          user: {
            id: this.currentUser,
            url: this.currentUser.url,
            profile_photo_path: this.currentUser.profile_photo_path,
            name: this.currentUser.name
          }
        }
        const indexRawComment = this.comments[index].sub_comments.length
        this.comments[index].sub_comments = [
          ...this.comments[index].sub_comments,
          rawComment
        ]
        if (this.page) {
          this.post.comments_count += 1
        } else {
          this.$emit('onSubComment')
        }
        this.showId = comment.id
        this.comments[index].sub_comments_count += 1
        try {
          let url = `/v1/user/post/comment/${comment.id}/create_sub_comment`
          let response = await axios.post(url, {
            content: this.subComment
          })
          this.comments[index].sub_comments[indexRawComment] = Object.assign(
            this.comments[index].sub_comments[indexRawComment],
            response.data.data
          )
        } catch (err) {
          this.createSubError = true
        }
        this.subComment = ''
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
      if (this.page) {
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
      } else {
        this.$emit('onLike', this.post)
      }
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
.z-index-4 {
  z-index: 4;
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
