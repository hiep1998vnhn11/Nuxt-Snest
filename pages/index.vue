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
<style scoped></style>
