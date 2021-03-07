<template>
  <div>
    <message-card v-if="thresh" />
    <nuxt-child />
  </div>
</template>
<script>
import axios from 'axios'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      loading: false,
      error: null,
      loadingMessageCard: false
    }
  },
  computed: {
    ...mapGetters('message', ['thresh'])
  }
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
