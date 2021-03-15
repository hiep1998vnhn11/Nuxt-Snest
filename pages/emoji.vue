<template>
  <div class="text-center">
    <div class="post-group-emoji">
      <div class="post-emoji-group-container">
        <div class="post-emoji-container">
          <emoji-group />
        </div>
      </div>
      <v-btn class="post-emoji-button">
        Test
      </v-btn>
    </div>
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
  }
  &:hover {
    transition: 0.5s ease-in-out;

    .post-emoji-group-container {
      display: block;
    }
  }
}
</style>
