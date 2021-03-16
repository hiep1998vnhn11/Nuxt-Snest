<template>
  <v-row no-gutters>
    <div class="comment-avatar-container">
      <base-name-link image :user="comment.user" />
    </div>
    <div class="comment-card-container">
      <div
        flat
        class="px-2 grey lighten-3 comment-card mx-auto my-1"
        min-width="20%"
        max-width="100%"
      >
        <base-name-link :user="comment.user"></base-name-link>
        {{ comment.content }}
        <div
          class="comment-reaction-chip text-caption"
          v-if="comment.liked_count"
        >
          <v-avatar size="15">
            <img src="@/assets/icons/reaction/like.svg" />
          </v-avatar>
          {{ comment.liked_count }}
        </div>
      </div>
      <div class="text-caption flex">
        <div
          class="comment-component-emoji-container"
          @mouseenter="hoverLike = true"
          @mouseleave="hoverLike = false"
        >
          <v-fade-transition>
            <div v-if="hoverLike" class="comment-emoji-container">
              <emoji-group @onClick="onClickLike" />
            </div>
          </v-fade-transition>
          <v-btn
            @click="onLike()"
            class="text-capitalize"
            :class="`${reactionColor}--text`"
            text
            :ripple="false"
            x-small
          >
            {{ reactionName }}
          </v-btn>
        </div>
        <v-btn
          @click="show = true"
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
      <div v-if="comment.sub_comments.length">
        <a v-if="!show" class="text-caption" @click="show = true">
          {{ comment.sub_comments_count }} {{ $t('Reply') }}
        </a>
        <a v-else class="text-caption" @click="show = false">
          {{ $t('Hide') }}{{ comment.sub_comments_count }}
        </a>
        <post-sub-comment
          v-for="sub_comment in comment.sub_comments"
          :key="`comment-${comment.id}-sub-${sub_comment.id}`"
          :sub_comment="sub_comment"
          :currentUser="currentUser"
        />
        <v-row
          no-gutters
          v-for="sub_comment in comment.sub_comments"
          :key="sub_comment.id"
          v-show="show"
        >
          <div class="comment-avatar-container">
            <base-name-link
              image
              :size="30"
              :user="sub_comment.user"
              class="mr-2"
            />
          </div>
          <div class="comment-card-container">
            <div class="grey lighten-3 comment-card">
              <base-name-link :user="sub_comment.user"></base-name-link>
              {{ sub_comment.content }}
            </div>
            <div class="text-caption flex">
              <div
                class="comment-component-emoji-container"
                @mouseenter="hoverLike = true"
                @mouseleave="hoverLike = false"
              >
                <v-fade-transition>
                  <div v-if="hoverLike" class="comment-emoji-container">
                    <emoji-group @onClick="onClickSubLike" />
                  </div>
                </v-fade-transition>
                <v-btn
                  @click="onSubLike"
                  class="text-capitalize"
                  :class="`${reactionColor}--text`"
                  text
                  :ripple="false"
                  x-small
                >
                  {{ reactionName }}
                </v-btn>
              </div>
              {{ sub_comment.created_at | relativeTime }}
            </div>
          </div>
        </v-row>
      </div>
      <v-expand-transition>
        <div v-if="show">
          <v-toolbar dense flat bottom v-if="isLoggedIn">
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
              @keydown.enter="onSubComment"
            >
            </v-text-field>
            <v-btn class="ml-3" small icon text outlined @click="onSubComment">
              <v-icon size="15">mdi-send</v-icon>
            </v-btn>
          </v-toolbar>
        </div>
      </v-expand-transition>
    </div>
  </v-row>
</template>
<script>
import axios from 'axios'
export default {
  props: ['comment', 'index', 'currentUser', 'isLoggedIn'],
  data() {
    return {
      show: false,
      subComment: '',
      hoverLike: false
    }
  },
  methods: {
    onSubComment() {
      if (this.subComment) {
        this.$emit('onSubComment', {
          comment: this.comment,
          index: this.index,
          subComment: this.subComment
        })
        this.subComment = ''
      }
    },
    upload() {
      this.comment.content = 1
    },
    async onClickLike(e) {
      this.hoverLike = false
      if (!this.currentUser) return
      if (this.comment.like_status) {
        const likeStatus = this.comment.like_status.status
        this.comment.like_status.status = likeStatus === e ? 0 : e
        if (this.comment.like_status.status === 0 && likeStatus !== 0) {
          this.comment.liked_count -= 1
        } else if (this.comment.like_status.status !== 0 && likeStatus === 0)
          this.comment.liked_count += 1
      } else {
        this.comment.like_status = {
          status: e
        }
        if (e > 0) this.comment.liked_count += 1
      }
      let url = `/v1/user/post/comment/${this.comment.id}/handle_like`
      await axios.post(url, {
        status: e
      })
    },
    onLike() {
      if (!this.comment.like_status || this.comment.like_status.status === 0) {
        this.onClickLike(1)
      } else {
        this.onClickLike(0)
      }
    },
    onClickSubLike(e) {
      this.hoverLike = false
    },
    onSubLike() {
      if (!this.comment.like_status || this.comment.like_status.status === 0) {
        this.onClickSubLike(1)
      } else {
        this.onClickSubLike(0)
      }
    }
  },
  created() {},
  mounted() {},
  computed: {
    reactionName() {
      if (!this.comment.like_status) return this.$t('Like')
      switch (this.comment.like_status.status) {
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
      if (!this.comment.like_status) return 'dark'
      switch (this.comment.like_status.status) {
        case 0:
          return 'dark'
        case 1:
          return 'primary'
        case 2:
          return 'red'
        default:
          return 'orange'
      }
    }
  }
}
</script>
<style lang="scss">
.flex {
  display: flex;
}
.comment-component-emoji-container {
  position: relative;
  .comment-emoji-container {
    display: none;
    position: absolute;
    top: -40px;
    left: 0px;
    opacity: 0;
    transition: opacity 1s ease-out;
    transform: scale(0.3);
  }

  &:hover {
    .comment-emoji-container {
      display: block;
      opacity: 1;
      transition: opacity 2s linear;
    }
  }
}

.comment-avatar-container {
  display: flex;
  position: relative;
  justify-content: center;
  width: 50px;
  padding: 10px;
}

.comment-card-container {
  position: relative;
  width: calc(100% - 50px);
  .comment-card {
    position: relative;
    border-radius: 15px;
    max-width: 100%;
    min-width: 100px;
    .comment-reaction-chip {
      position: absolute;
      z-index: 2;
      background: white;
      border: 1px solid rgba(0, 0, 0, 0.1);
      right: 10px;
      top: -5px;
      border-radius: 999px;
      padding: 0 3px;
    }
  }
}
</style>
