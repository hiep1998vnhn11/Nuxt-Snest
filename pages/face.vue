<template>
  <div class="flex-center" ref="face-container">
    <video
      @play="onPlayVideo"
      ref="face-video"
      width="720"
      height="560"
      autoplay
      muted
    ></video>
  </div>
</template>
<script>
import * as faceapi from '@/services/face/face-api.min.js'
export default {
  data() {
    return {
      stream: null
    }
  },
  beforeRouteLeave(to, from, next) {
    this.stream.getTracks().forEach(track => {
      track.stop()
    })
    return next()
  },
  methods: {
    startVideo(video) {
      navigator.getUserMedia(
        { video: {} },
        stream => {
          video.srcObject = stream
          this.stream = stream
        },
        err => console.log(err)
      )
    },
    onPlayVideo() {
      const video = this.$refs['face-video']
      const canvas = faceapi.createCanvasFromMedia(video)
      const faceContainer = this.$refs['face-container']
      faceContainer.append(canvas)
      const displaySize = { width: video.width, height: video.height }
      faceapi.matchDimensions(canvas, displaySize)
      setInterval(async () => {
        const detections = await faceapi
          .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceExpressions()
        const resizedDetections = faceapi.resizeResults(detections, displaySize)
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
        faceapi.draw.drawDetections(canvas, resizedDetections)
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
        faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
      }, 100)
    }
  },
  created() {},
  mounted() {
    const video = this.$refs['face-video']
    Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
      faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
      faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
      faceapi.nets.faceExpressionNet.loadFromUri('/models')
    ]).then(this.startVideo(video))
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

canvas {
  position: absolute;
}
</style>
