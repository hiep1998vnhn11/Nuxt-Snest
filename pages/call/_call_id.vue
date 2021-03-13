<template>
  <div class="call-container">
    <v-btn icon text large @click="myVideo = !myVideo">
      <v-icon>mdi-camera</v-icon>
    </v-btn>
    <div ref="video-call" class="video-call">
      <video v-show="myVideo" ref="my-video" class="my-video"></video>
      <video v-if="guestVideo" ref="guest-video" class="my-video"></video>
      <video v-if="hostVideo" ref="host-video" class="my-video"></video>
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
      peer: null
    }
  },
  methods: {
    connect() {
      window.socket.on('call_not_found', call_id => {
        this.$router.push(this.localePath({ name: 'test' }))
      })
      const myVideo = this.$refs['my-video']
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
            vm.hostVideo = true
            const hostVideo = vm.$refs['host-video']
            hostVideo.muted = true
            call.on('stream', userVideoStream => {
              vm.addVideoStream(hostVideo, userVideoStream)
            })
          })
          window.socket.on('user-join', ({ user_id, peer_id }) => {
            console.log(`an user had connected ${peer_id} ${user_id}`)
            this.connectToNewUser(peer_id, stream)
          })
        })
      // if (!this.currentUser || !window.socket || window.socket.disconnected)
      //   return
    },
    addVideoStream(video, stream) {
      video.srcObject = stream
      video.addEventListener('loadedmetadata', () => {
        video.play()
      })
    },
    connectToNewUser(userId, stream) {
      const vm = this
      const call = this.peer.call(userId, stream)
      this.guestVideo = true
      const guestVideo = this.$refs['guest-video']
      guestVideo.muted = true
      call.on('stream', userVideoStream => {
        vm.addVideoStream(guestVideo, userVideoStream)
      })
      call.on('close', () => {
        guestVideo.remove()
        vm.guestVideo = false
      })
    }
  },
  created() {},
  mounted() {
    this.peer = new Peer(undefined, {
      host: '/',
      port: '8081'
    })
    this.connect()

    this.peer.on('open', id => {
      window.socket.emit('join-call', {
        call_id: this.$route.params.call_id,
        user_id: this.currentUser.id,
        peer_id: id
      })
    })
  },
  computed: {
    ...mapGetters('user', ['currentUser'])
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
  }
}
</style>
