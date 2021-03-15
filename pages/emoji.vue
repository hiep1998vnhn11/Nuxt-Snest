<template>
  <div class="post-group-emoji">
    <emoji-like @onClickLike="onClickLike" />
    asd
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
  position: relative;
  display: flex;
}
</style>
