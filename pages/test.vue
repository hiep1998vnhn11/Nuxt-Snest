<template>
  <div>
    {{ count }}
    <br />
    <v-btn @click="increase()">increase</v-btn>
  </div>
</template>
<script>
export default {
  data() {
    return {
      count: 1
    }
  },
  methods: {
    increase() {
      this.count++
    }
  },
  created() {},
  mounted() {},
  computed: {}
}
</script>
<style scoped></style>
