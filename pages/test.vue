<template>
  <div>
    <button-test :user="currentUser" />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {}
  },
  computed: {
    ...mapGetters('user', ['currentUser'])
  },

  created() {},
  mounted() {},
  computed: {}
}
</script>
<style scoped></style>
