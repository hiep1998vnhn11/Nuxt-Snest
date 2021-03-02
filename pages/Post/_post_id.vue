<template>
  <v-container class="grey lighten-3">
    <post-component v-if="!!paramPost" :post="paramPost"></post-component>
  </v-container>
</template>

<script>
import PostComponent from '@/components/Post/PostComponent'
import axios from 'axios'
import { mapGetters, mapActions } from 'vuex'

export default {
  async created() {
    if (!this.currentUser) await this.getUser()
    await this.getPost(this.$route.params.post_id)
  },
  data() {
    return {
      paramPost: null
    }
  },
  computed: mapGetters('user', ['isLoggedIn', 'currentUser']),
  methods: {
    ...mapActions('user', ['getUser']),
    async getPost(postId) {
      let url = this.isLoggedIn
        ? `/v1/user/post/${postId}/get`
        : `/v1/guest/post/${postId}/get`
      const response = await axios.get(url)
      this.paramPost = response.data.data
    }
  },
  components: {
    PostComponent
  }
}
</script>
