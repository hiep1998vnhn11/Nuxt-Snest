<template>
  <div class="call-container">
    <message-card v-if="chat" />
    <div ref="video-call" class="video-call">
      <!-- <video ref="video-me" class="my-video"></video> -->
      <video ref="video-me" autoplay playsinline class="my-video"></video>
      <video ref="video-guest" class="other-video"></video>
      <video ref="video-host" class="other-video"></video>
    </div>
    <div v-if="removed">
      This call was removed!
    </div>
    <div class="call-actions">
      <div class="call-action-chat">
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              class="grey lighten-3"
              color="dark"
              icon
              x-large
              v-bind="attrs"
              v-on="on"
              @click="chat = !chat"
            >
              <v-icon>
                {{ chat ? 'mdi-chat-remove-outline' : 'mdi-chat-outline' }}
              </v-icon>
            </v-btn>
          </template>
          <span>{{ chat ? $t('CloseChat') : $t('OpenChat') }}</span>
        </v-tooltip>
      </div>

      <v-tooltip top>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            v-bind="attrs"
            v-on="on"
            icon
            text
            class="grey lighten-3"
            color="dark"
            x-large
            @click="changeVideo"
          >
            <v-icon>{{ video ? 'mdi-camcorder' : 'mdi-camcorder-off' }}</v-icon>
          </v-btn>
        </template>
        <span>{{ video ? $t('TurnOffCamera') : $t('TurnOnCamera') }}</span>
      </v-tooltip>
      <v-tooltip top>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            v-bind="attrs"
            v-on="on"
            icon
            width="70"
            height="70"
            class="danger mx-3"
            @click="onTurnOffCall"
          >
            <v-icon>mdi-phone-cancel</v-icon>
          </v-btn>
        </template>
        <span>{{ $t('EndCall') }}</span>
      </v-tooltip>
      <v-tooltip top>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            class="grey lighten-3"
            color="dark"
            v-bind="attrs"
            v-on="on"
            icon
            x-large
            @click="changeAudio"
          >
            <v-icon>
              {{ audio ? 'mdi-microphone' : 'mdi-microphone-off' }}
            </v-icon>
          </v-btn>
        </template>
        <span> {{ audio ? 'TurnOffMicro' : 'TurnOnMicro' }} </span>
      </v-tooltip>
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
      removed: false,
      calling: true,
      answer: false,
      video: true,
      audio: true,
      chat: false
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
    },
    stopStreamedVideo(videoElem) {
      const stream = videoElem.srcObject
      const tracks = stream.getTracks()
      console.log(tracks)
      // tracks.forEach(function(track) {
      //   track.stop()
      // })
      // videoElem.srcObject = null
    },
    changeVideo() {
      //change video is enable or not
      this.video = !this.video
      const myVideoTrack = this.$refs['video-me'].srcObject.getVideoTracks()
      myVideoTrack[0].enabled = this.video
    },
    changeAudio() {
      //change video is enable or not
      this.audio = !this.audio
      const myAudioTrack = this.$refs['video-me'].srcObject.getAudioTracks()
      myAudioTrack[0].enabled = this.audio
    },
    onTurnOffCall() {}
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
    height: 100%;
    .other-video {
      position: absolute;
      align-items: center;
      max-height: 100%;
      max-width: 100%;
      height: 100%;
      z-index: 1;
    }
    .my-video {
      position: absolute;
      top: 2%;
      right: 2%;
      width: 300px;
      border-radius: 15px;
      border: thin 1px;
      z-index: 100;
    }
  }

  .call-actions {
    position: absolute;
    width: 100%;
    bottom: 0px;
    display: flex;
    padding: 40px;
    z-index: 99;
    justify-content: center;
    align-items: center;
    .call-action-chat {
      position: absolute;
      left: 40px;
    }
  }
}
</style>
