<template>
  <post-component :post="post" page class="mt-1"></post-component>
</template>

<script>
import axios from 'axios'

export default {
  async asyncData({ params, store, $http, error }) {
    const postId = params.post_id
    const url = store.getters['user/currentUser']
      ? `/v1/user/post/${postId}/get`
      : `/v1/guest/post/${postId}/get`
    try {
      const response = await axios.get(url)
      return { post: response.data.data }
    } catch (err) {
      error(err)
    }
  }
}
</script>
