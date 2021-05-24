<template>
  <div v-if="loading" class="loading-page">
    <section>
      <div class="loading">
        <span style="--i: 1;"></span>
        <span style="--i: 2;"></span>
        <span style="--i: 3;"></span>
        <span style="--i: 4;"></span>
        <span style="--i: 5;"></span>
        <span style="--i: 6;"></span>
        <span style="--i: 7;"></span>
        <span style="--i: 8;"></span>
        <span style="--i: 9;"></span>
        <span style="--i: 10;"></span>
        <span style="--i: 11;"></span>
        <span style="--i: 12;"></span>
        <span style="--i: 13;"></span>
        <span style="--i: 14;"></span>
        <span style="--i: 15;"></span>
        <span style="--i: 16;"></span>
        <span style="--i: 17;"></span>
        <span style="--i: 18;"></span>
        <span style="--i: 19;"></span>
        <span style="--i: 20;"></span>
      </div>
    </section>
  </div>
</template>
<script>
export default {
  data: () => ({
    loading: false
  }),
  methods: {
    start() {
      this.loading = true
    },
    finish() {
      this.loading = false
    }
  },
  created() {},
  mounted() {},
  computed: {}
}
</script>
<style scoped>
.loading-page {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.8);
  text-align: center;
  z-index: 9999;
}

section {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #042104;
  animation: animateBg 20s linear infinite;
}

@keyframes animateBg {
  0% {
    filter: hue-rotate(0deg);
  }
  100% {
    filter: hue-rotate(360deg);
  }
}

section .loading {
  position: relative;
  width: 120px;
  height: 120px;
}

section .loading span {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transform: rotate(calc(18deg * var(--i)));
}

section .loading span::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  transform: scale(0);
  background: #00ff0a;
  box-shadow: 0 0 10px #00ff0a, 0 0 20px #00ff0a, 0 0 40px #00ff0a,
    0 0 60px #00ff0a, 0 0 80px #00ff0a, 0 0 100px #00ff0a;
  animation: animate 2s linear infinite;
  animation-delay: calc(0.1s * var(--i));
}

@keyframes animate {
  0% {
    transform: scale(1);
  }
  100%,
  80% {
    transform: scale(0);
  }
}
</style>
