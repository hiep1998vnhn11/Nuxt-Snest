<template>
  <v-row no-gutters>
    <div class="comment-avatar-container">
      <base-name-link image :size="30" :user="sub_comment.user" class="mr-2" />
    </div>
    <div class="comment-card-container">
      <div class="grey lighten-3 comment-card px-2">
        <base-name-link :user="sub_comment.user"></base-name-link>
        {{ sub_comment.content }}
        <div
          class="comment-reaction-chip text-caption"
          v-if="sub_comment.liked_count"
        >
          <v-avatar size="15">
            <img src="@/assets/icons/reaction/like.svg" />
          </v-avatar>
          {{ sub_comment.liked_count }}
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
            @click="onLike"
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
</template>
<script>
import axios from 'axios'
export default {
  props: ['currentUser', 'sub_comment', 'isLoggedIn'],
  data() {
    return {
      hoverLike: false
    }
  },
  methods: {
    async onClickLike(e) {
      this.hoverLike = false
      if (!this.currentUser) return
      if (this.sub_comment.like_status) {
        const likeStatus = this.sub_comment.like_status.status
        this.sub_comment.like_status.status = likeStatus === e ? 0 : e
        if (this.sub_comment.like_status.status === 0 && likeStatus !== 0) {
          this.sub_comment.liked_count -= 1
        } else if (
          this.sub_comment.like_status.status !== 0 &&
          likeStatus === 0
        )
          this.sub_comment.liked_count += 1
      } else {
        this.sub_comment.like_status = {
          status: e
        }
        if (e > 0) this.sub_comment.liked_count += 1
      }
      let url = `/v1/user/post/comment/sub_comment/${this.sub_comment.id}/handle_like`
      await axios.post(url, {
        status: e
      })
    },
    onLike() {
      if (
        !this.sub_comment.like_status ||
        this.sub_comment.like_status.status === 0
      ) {
        this.onClickLike(1)
      } else {
        this.onClickLike(0)
      }
    }
  },
  created() {},
  mounted() {},
  computed: {
    reactionName() {
      if (!this.sub_comment.like_status) return this.$t('Like')
      else
        switch (this.sub_comment.like_status.status) {
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
      if (!this.sub_comment.like_status) return 'dark'
      else
        switch (this.sub_comment.like_status.status) {
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
<style></style>
