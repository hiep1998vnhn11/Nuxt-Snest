<template>
  <div>
    <message-card />
    <nuxt-child />
  </div>
</template>
<script>
import axios from 'axios'
export default {
  data() {
    return {
      thresh: null,
      loading: false,
      error: null,
      loadingMessageCard: false
    }
  },
  methods: {
    async onOpenMessage(user) {
      this.loadingMessageCard = true
      try {
        const response = await axios.post(`/v1/user/thresh/${user.id}/get`)
        if (response.data.data) {
          this.thresh = response.data.data
        } else {
          this.thresh = { user_with: user }
        }
      } catch (err) {
        this.error = err.response.data.message
      }
      this.loadingMessageCard = false
    }
  },
  created() {
    console.log(this.$route.name)
  },
  mounted() {}
}
</script>
<style scoped>
.button-navigation {
  position: fixed;
  z-index: 9999;
  bottom: 15px;
  right: 15px;
}
</style>
