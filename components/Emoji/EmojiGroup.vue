<template>
  <div class="emoji--container">
    <div class="emoji  emoji--like" @click="$emit('onClickLike')">
      <div class="emoji__hand">
        <div class="emoji__thumb"></div>
      </div>
    </div>
    <div class="emoji  emoji--love" @click="$emit('onClickLove')">
      <div class="emoji__heart"></div>
    </div>
    <div class="emoji  emoji--haha" @click="$emit('onClickHaha')">
      <div class="emoji__face">
        <div class="emoji__eyes"></div>
        <div class="emoji__mouth">
          <div class="emoji__tongue"></div>
        </div>
      </div>
    </div>
    <div class="emoji  emoji--yay" @click="$emit('onClickYay')">
      <div class="emoji__face">
        <div class="emoji__eyebrows"></div>
        <div class="emoji__mouth"></div>
      </div>
    </div>
    <div class="emoji  emoji--wow" @click="$emit('onClickWow')">
      <div class="emoji__face">
        <div class="emoji__eyebrows"></div>
        <div class="emoji__eyes"></div>
        <div class="emoji__mouth"></div>
      </div>
    </div>
    <div class="emoji  emoji--sad" @click="$emit('onClickSad')">
      <div class="emoji__face">
        <div class="emoji__eyebrows"></div>
        <div class="emoji__eyes"></div>
        <div class="emoji__mouth"></div>
      </div>
    </div>
    <div class="emoji  emoji--angry" @click="$emit('onClickAngry')">
      <div class="emoji__face">
        <div class="emoji__eyebrows"></div>
        <div class="emoji__eyes"></div>
        <div class="emoji__mouth"></div>
      </div>
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
      console.log('Liked!')
    }
  },
  created() {},
  mounted() {},
  computed: {}
}
</script>
<style lang="scss" scoped>
@import '@/assets/emoji.scss';
</style>
