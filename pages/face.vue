<template>
  <div class="flex-center">
    <video ref="face-video" width="560" height="720" autoplay muted></video>
  </div>
</template>
<script>
import * as faceapi from '@/services/face/face-api.min.js'
export default {
  data() {
    return {}
  },
  methods: {
    startVideo(video) {
      navigator.getUserMedia(
        { video: {} },
        stream => (video.srcObject = stream),
        err => console.log(err)
      )
    }
  },
  created() {},
  mounted() {
    const video = this.$refs['face-video']
    Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri('_nuxt/assets/models')
    ])
    this.startVideo(video)
  },
  computed: {}
}
</script>
<style lang="scss">
.flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

video {
  -webkit-transform: scaleX(-1);
  transform: scaleX(-1);
}
</style>
