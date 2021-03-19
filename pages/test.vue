<template>
  <div>
    <v-btn @click="test">
      test
    </v-btn>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {}
  },
  methods: {
    test() {
      const usercall = {
        user: {
          profile_photo_path:
            'https://p.bigstockphoto.com/GeFvQkBbSLaMdpKXF1Zv_bigstock-Aerial-View-Of-Blue-Lakes-And--227291596.jpg',
          name: 'Hiệp Trần'
        }
      }
      this.$store.commit('message/SET_CALLING_USER', usercall)
      this.$store.commit('message/SET_CALLING_STATUS', 'calling')
    }
  },
  created() {},
  mounted() {},
  computed: {
    ...mapGetters('message', ['calling'])
  }
}
</script>
<style scoped></style>
