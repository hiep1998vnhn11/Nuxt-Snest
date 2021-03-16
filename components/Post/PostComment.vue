<template>
  <v-row justify="space-around" no-gutters>
    {{ comment.likes }}
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
            @click="show = true"
            class="text-capitalize"
            text
            :ripple="false"
            x-small
          >
            like
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
        <a v-show="!show" class="text-caption" @click="show = true">
          {{ comment.sub_comments_count }} {{ $t('Reply') }}
        </a>
        <v-row
          justify="space-around"
          no-gutters
          v-for="sub_comment in comment.sub_comments"
          :key="sub_comment.id"
          v-show="show"
        >
          <div>
            <base-name-link image :user="sub_comment.user" class="mr-2" />
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
      <v-expand-transition>
        <div v-if="show">
          <v-app-bar color="white" elevation="0" bottom v-if="isLoggedIn">
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
          </v-app-bar>
        </div>
      </v-expand-transition>
    </v-col>
  </v-row>
</template>
<script>
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
    }
  },
  created() {},
  mounted() {},
  computed: {}
}
</script>
<style lang="scss" scoped>
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
</style>
