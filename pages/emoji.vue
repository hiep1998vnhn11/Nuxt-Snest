<template>
  <div class="post-group-emoji">
    <emoji-group />
  </div>
</template>
<script>
export default {
  data() {
    return {}
  },
  methods: {
    onClickLike() {
      console.log('liked!')
    }
  },
  created() {},
  mounted() {},
  computed: {}
}
</script>
<style lang="scss" scoped>
.post-group-emoji {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  justify-content: center;
  align-items: center;
  .post-emoji-group-container {
    position: absolute;
    display: none;
    background: red;
    top: -70px;
    z-index: 9999;
    transition: 0.5s ease-in-out;
    transform: scale(0.5);
  }
  &:hover {
    transition: 0.5s ease-in-out;

    .post-emoji-group-container {
      display: block;
    }
  }
}
</style>
