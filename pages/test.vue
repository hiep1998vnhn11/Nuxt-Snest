<template>
  <div>
    <v-btn @click="generateUuidV4">
      Test
    </v-btn>
  </div>
</template>
<script>
import { v4 as uuidv4 } from 'uuid'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {}
  },
  methods: {
    generateUuidV4() {
      const callId = uuidv4()
      window.socket.emit('create-call', {
        call_id: callId,
        user_id: this.currentUser.id
      })
      this.$router.push(
        this.localePath({ name: 'call-call_id', params: { call_id: callId } })
      )
    }
  },
  created() {},
  mounted() {},
  computed: {
    ...mapGetters('user', ['currentUser'])
  }
}
</script>
<style scoped></style>
