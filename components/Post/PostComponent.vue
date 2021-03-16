<template>
  <v-card :class="`mx-auto hover-up`" flat>
    <div class="post-component-header">
      <v-avatar size="45" class="ml-1 mr-3">
        <base-name-link image :user="post.user" />
      </v-avatar>
      <div class="post-component-header-name">
        <base-name-link :user="post.user" />
        <span class="text-caption">
          {{ post.created_at | relativeTime }}
        </span>
      </div>
      <div class="post-component-header-option">
        <button-option-post v-if="!!this.currentUser" :post="post" />
      </div>
    </div>

    <!-- post content -->
    <v-container v-if="post">
      {{ post.content }}
      <div v-if="comments.length"></div>
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
    <div class="px-5">
      <v-avatar size="20">
        <img src="@/assets/icons/reaction/like.svg" />
      </v-avatar>
      {{ post.liked_count }}
    </div>

    <!-- post like and comment count -->
    <v-toolbar flat>
      <div
        class="post-component-emoji-container"
        @mouseenter="hoverLike = true"
        @mouseleave="hoverLike = false"
      >
        <v-fade-transition>
          <div v-if="hoverLike" class="post-emoji-container">
            <emoji-group @onClick="onClickLike" />
          </div>
        </v-fade-transition>

        <v-btn
          class="text-capitalize rounded-lg"
          text
          @click="onLike"
          :ripple="false"
          outlined
        >
          <v-fade-transition>
            <img
              v-if="!post.like_status || post.like_status.status === 0"
              width="25"
              height="25"
              src="@/assets/icons/reaction/like-outlined.png"
            />
            <img
              v-else-if="post.like_status.status === 1"
              width="25"
              height="25"
              src="@/assets/icons/reaction/like.png"
            />
            <img
              v-else-if="post.like_status.status === 2"
              width="25"
              height="25"
              src="@/assets/icons/reaction/love.svg"
            />
            <img
              v-else-if="post.like_status.status === 3"
              width="25"
              height="25"
              src="@/assets/icons/reaction/haha.svg"
            />
            <img
              v-else-if="post.like_status.status === 4"
              width="25"
              height="25"
              src="@/assets/icons/reaction/care.svg"
            />
            <img
              v-else-if="post.like_status.status === 5"
              width="25"
              height="25"
              src="@/assets/icons/reaction/wow.svg"
            />
            <img
              v-else-if="post.like_status.status === 6"
              width="25"
              height="25"
              src="@/assets/icons/reaction/sad.svg"
            />
            <img
              v-else-if="post.like_status.status === 7"
              width="25"
              height="25"
              src="@/assets/icons/reaction/angry.svg"
            />
          </v-fade-transition>
          <span class="ml-3" :class="`${reactionColor}--text`">
            {{ reactionName }}
          </span>
        </v-btn>
      </div>

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
        <div v-else-if="comments.length">
          <div
            v-for="(comment, index) in comments"
            :key="`comment-${comment.id}`"
          >
            <post-comment
              :currentUser="currentUser"
              :isLoggedIn="isLoggedIn"
              :comment="comment"
              :index="index"
              @onSubComment="onSubComment"
            />
          </div>
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
  props: ['post', 'page', 'index'],
  data: () => {
    return {
      hover: false,
      showComment: false,
      writeComment: false,
      comment: '',
      deleteDialog: false,
      isLike: false,
      comments: [],
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
      subComment: '',
      hoverLike: false,
      iconTest: 0
    }
  },
  computed: {
    ...mapGetters('user', ['currentUser', 'isLoggedIn']),
    reactionName() {
      if (!this.post.like_status) return this.$t('Like')
      switch (this.post.like_status.status) {
        case 2:
          return this.$t('Love')
        case 3:
          return this.$t('Haha')
        case 4:
          return this.$t('Yay')
        case 5:
          return this.$t('Wow')
        case 6:
          return this.$t('Sad')
        case 7:
          return this.$t('Angry')
        default:
          return this.$t('Like')
      }
    },
    reactionColor() {
      if (!this.post.like_status) return 'grey'
      switch (this.post.like_status.status) {
        case 0:
          return 'grey'
        case 1:
          return 'primary'
        case 2:
          return 'red'
        default:
          return 'orange'
      }
    }
  },
  methods: {
    ...mapActions('post', ['deletePost', 'createPost']),
    async onClickLike(e) {
      // e is status of reaction [1...7]
      this.hoverLike = false
      if (this.page) {
        if (!this.currentUser) return
        if (this.post.like_status) {
          const likeStatus = this.post.like_status.status
          this.post.like_status.status = likeStatus === e ? 0 : e
          if (this.post.like_status.status === 0 && likeStatus !== 0) {
            this.post.liked_count -= 1
          } else if (this.post.like_status.status !== 0 && likeStatus === 0)
            this.post.liked_count += 1
        } else {
          this.post.like_status = {
            status: e
          }
          if (e > 0) this.post.liked_count += 1
        }
        let url = `/v1/user/post/${this.post.id}/handle_like`
        await axios.post(url, {
          status: e
        })
      } else {
        this.$emit('onLike', {
          post: this.post,
          status: e,
          index: this.index
        })
      }
    },
    async getComment() {
      if (!this.showComment) return
      this.comments = []
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
          this.$nuxt.error(err)
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
        this.comments[indexRawComment] = Object.assign(
          this.comments[indexRawComment],
          response.data.data
        )
        try {
          let url = `/v1/user/post/${this.post.id}/create_comment`
          let response = await axios.post(url, {
            content: this.comment
          })
        } catch (err) {
          this.createError = true
        }
        this.comment = ''
        this.loadingCreate = false
      }
    },
    async onSubComment(e) {
      const rawComment = {
        id: Math.random(),
        content: e.subComment,
        created_at: moment.utc().format(),
        updated_at: moment.utc().format(),
        user: {
          id: this.currentUser,
          url: this.currentUser.url,
          profile_photo_path: this.currentUser.profile_photo_path,
          name: this.currentUser.name
        }
      }
      const indexRawComment = this.comments[e.index].sub_comments.length
      this.comments[e.index].sub_comments = [
        ...this.comments[e.index].sub_comments,
        rawComment
      ]

      //comments count ++
      if (this.page) {
        this.post.comments_count += 1
      } else {
        this.$emit('onSubComment')
      }
      this.comments[e.index].sub_comments[indexRawComment] = Object.assign(
        this.comments[e.index].sub_comments[indexRawComment],
        response.data.data
      )

      try {
        let url = `/v1/user/post/comment/${e.comment.id}/create_sub_comment`
        let response = await axios.post(url, {
          content: e.subComment
        })
      } catch (err) {
        this.$nuxt.error(err)
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
    onLike() {
      if (!this.post.like_status || this.post.like_status.status === 0) {
        this.onClickLike(1)
      } else {
        this.onClickLike(0)
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

<style lang="scss" scoped>
.z-index-4 {
  z-index: 4;
}
.fixed {
  position: fixed;
  z-index: 6;
  left: 50%;
}

.relative {
  position: relative;
}

.absolute {
  position: absolute;
}

.post-component-emoji-container {
  .post-emoji-container {
    display: none;
    position: absolute;
    top: -40px;
    left: 0px;
    opacity: 0;
    transition: opacity 1s;
    transform: scale(0.4);
    transition-delay: 2s;
  }

  &:hover {
    .post-emoji-container {
      display: block;
      opacity: 1;
      transition-delay: 2s;
    }
  }
}

.post-component-header {
  display: flex;
  align-items: center;
  padding: 5px;
  .post-component-header-option {
    position: absolute;
    right: 15px;
  }
}
</style>
