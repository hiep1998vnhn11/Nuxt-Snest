<template>
  <div class="call-container">
    <v-btn icon text large @click="myVideo = !myVideo">
      <v-icon>mdi-camera</v-icon>
    </v-btn>
    {{ peers }}
    <div ref="video-call" class="video-call">
      <video ref="video-me" class="my-video"></video>
      <video ref="video-guest" class="other-video"></video>
      <video ref="video-host" class="other-video"></video>
    </div>
    <div v-if="removed">
      This call was removed!
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  middleware: 'checkV4',
  data() {
    return {
      video: true,
      audio: true,
      myVideo: true,
      guestVideo: false,
      hostVideo: false,
      connections: [],
      remotePeer: [],
      peers: {},
      peer: null,
      myPeer: null,
      removed: false
    }
  },
  methods: {
    connect() {
      window.socket.on('call_not_found', call_id => {
        this.$router.push(this.localePath({ name: 'test' }))
      })
      window.socket.on('user-leave', ({ user_id, peer_id }) => {
        console.log(`an user ${user_id} has left the ${peer_id}`)
        if (this.peers[peer_id]) this.peers[peer_id].close()
      })
      window.socket.on('remove-call', () => {
        this.removed = true
      })
      const myVideo = this.$refs['video-me']
      myVideo.muted = true
      const vm = this
      navigator.mediaDevices
        .getUserMedia({
          video: true,
          audio: true
        })
        .then(stream => {
          vm.addVideoStream(myVideo, stream)
          vm.peer.on('call', call => {
            call.answer(stream)
            const hostVideo = vm.$refs['video-host']
            hostVideo.muted = true
            call.on('stream', userVideoStream => {
              vm.addVideoStream(hostVideo, userVideoStream)
            })
          })
          window.socket.on('user-join', ({ user_id, peer_id }) => {
            console.log(`an user had connected ${peer_id} ${user_id}`)
            vm.connectToNewUser(peer_id, stream)
          })
        })
    },
    addVideoStream(video, stream) {
      video.srcObject = stream
      video.addEventListener('loadedmetadata', () => {
        video.play()
      })
    },
    connectToNewUser(userPeerId, stream) {
      const vm = this
      const call = this.peer.call(userPeerId, stream)
      this.peers[userPeerId] = stream
      const guestVideo = this.$refs['video-guest']
      guestVideo.muted = true
      call.on('stream', userVideoStream => {
        vm.addVideoStream(guestVideo, userVideoStream)
      })
      call.on('close', () => {
        guestVideo.remove()
        vm.guestVideo = false
      })
    },
    createPeer() {
      this.peer = new Peer(undefined, {
        host: process.env.NUXT_ENV_PEER_HOST,
        port: process.env.NUXT_ENV_PEER_PORT
      })
      //local peer id
      this.peer.on('open', id => {
        this.remotePeer.push(id)
        this.myPeer = id
        window.socket.emit('join-call', {
          call_id: this.$route.params.call_id,
          user_id: this.currentUser.id,
          peer_id: id
        })
      })
      this.peer.on('connection', conn => {
        console.log(conn)
      })
    }
  },
  mounted() {
    this.createPeer()
    this.connect()
  },
  computed: {
    ...mapGetters('user', ['currentUser'])
  },
  watch: {
    $route() {
      window.socket.emit('remove-call', {
        user_id: this.currentUser.id,
        call_id: this.$route.params.call_id,
        peer_id: this.myPeer
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.call-container {
  position: fixed;
  z-index: 9999;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  background: linear-gradient(60deg, #1a5cff, #f904fe);

  .video-call {
    position: relative;
    display: flex;
    padding: 20px;
    justify-content: center;
    align-items: center;
    background: red;
    .my-video {
      width: 300px;
    }
    .other-video {
      width: 500px;
    }
  }
}
</style>
