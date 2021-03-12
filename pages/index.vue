<template>
  <div v-if="isLoggedIn">
    <transition name="fade">
      <message-card v-if="thresh" />
    </transition>
    <nuxt-child />
  </div>
  <div v-else>
    <login-page />
  </div>
</template>
<script>
import LoginPage from './login/index'
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
    ...mapGetters('message', ['thresh']),
    ...mapGetters('user', ['isLoggedIn'])
  },
  components: {
    LoginPage
  }
}
</script>
<style lang="scss" scoped>
.fade-enter-active {
  transition: opacity 0.5s;
}
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter {
  opacity: 0;
}
.fade-leave-to {
  opacity: 0;
}
</style>
