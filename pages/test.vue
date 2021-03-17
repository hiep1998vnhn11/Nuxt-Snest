<template>
  <div>
    <v-btn @click="test">
      test
    </v-btn>
  </div>
</template>
<script>
export default {
  data() {
    return {}
  },
  methods: {
    test() {
      this.$notify({
        group: 'call',
        text: {
          user: {
            profile_photo_path:
              'https://www.intouchweekly.com/wp-content/uploads/2020/02/Eminem-Oscars-2020.jpg?w=1660',
            name: 'Hiệp Trần'
          }
        }
      })
    }
  },
  created() {},
  mounted() {},
  computed: {}
}
</script>
<style scoped></style>
