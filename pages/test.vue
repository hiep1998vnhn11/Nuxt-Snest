<template>
  <div>
    <v-btn @click="generateUuidV4">
      Test
    </v-btn>
    {{ peers }}
    <div v-for="(index, peer) in peers" :key="index">
      {{ index }} : {{ peer }}
    </div>
  </div>
</template>
<script>
import { v4 as uuidv4 } from 'uuid'
import { mapGetters, mapActions } from 'vuex'
export default {
  data() {
    return {
      peers: []
    }
  },
  methods: {
    ...mapActions('socket', ['pushPeers']),
    generateUuidV4() {
      this.peers.push({
        peer_id: uuidv4(),
        stream: uuidv4()
      })
    }
  },
  created() {},
  mounted() {},
  computed: {
    // ...mapGetters('socket', ['peers']),
    ...mapGetters('user', ['currentUser'])
  }
}
</script>
<style scoped></style>
