<template>
  <v-card class="mx-auto rounded-lg">
    <v-list-item>
      <router-link
        :to="{ name: 'user-url', params: { url: post.user.url } }"
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
      </router-link>
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
    <v-row>
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
    </v-row>
    <v-divider class="mx-4"></v-divider>
    <v-card-actions>
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
    </v-card-actions>
    <post-comment
      :post_id="post.id"
      @close-dialog="showComment = false"
      :dialog="showComment"
    ></post-comment>
    <v-dialog v-model="deleteDialog" max-width="290">
      <v-card>
        <v-card-title class="headline">Delete Post?</v-card-title>
        <v-card-text> Do you want to delete this post? </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="deleteDialog = false">
            Disagree
          </v-btn>
          <v-btn color="green darken-1" text @click="deletePost(post.id)">
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
      isLike: false
    }
  },
  created() {
    if (!this.currentUser) this.getUser()
  },
  computed: mapGetters('user', ['currentUser', 'isLoggedIn']),
  methods: {
    ...mapActions('post', ['deletePost', 'createPost']),
    ...mapActions('user', ['getUser']),
    openCommentDialog() {
      this.writeComment = true
    },
    closeCommentDialog() {
      this.writeComment = false
    },

    async deletePost(postId) {
      await this.deletePost(postId)
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
</style>
