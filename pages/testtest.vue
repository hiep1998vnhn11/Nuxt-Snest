<template>
  <div>
    {{ currentUser }}
    <v-btn @click="onClick">test</v-btn>
    <v-btn @click="change">change</v-btn>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  data() {
    return {}
  },
  layout: 'login',
  computed: {
    ...mapGetters('user', ['currentUser'])
  },
  methods: {
    ...mapActions(['clearAllState']),
    onClick() {
      this.clearAllState()
    },
    change() {
      this.$store.commit('post/SET_POST', ['asda', 'asd'])
    }
  },
  created() {},
  mounted() {},
  computed: {}
}
</script>
<style scoped></style>
