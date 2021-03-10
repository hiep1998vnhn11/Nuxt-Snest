<template>
  <div>
    <v-btn @click="onToast">toast</v-btn>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      toast: true
    }
  },
  props: {
    color: {
      type: String,
      default: 'dark'
    },
    delay: {
      type: Number,
      default: 3000
    },
    title: String,
    content: String
  },
  methods: {},
  created() {},
  mounted() {
    // setTimeout(() => {
    //   this.toast = false
    // }, this.delay)
  },
  computed: {
    ...mapGetters('user', ['currentUser'])
  }
}
</script>
<style lang="scss" scoped>
.toast-notification {
  position: fixed;
  top: 15px;
  right: 15px;
  z-index: 9999;

  .toast-notification-button {
    position: absolute;
    top: 10px;
    right: 10px;
  }
}
</style>
