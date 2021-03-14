<template>
  <div v-if="calling" class="calling-container">
    <v-card width="500">
      <v-card-title>
        {{ $t('IncomingCall') }}
        <v-spacer></v-spacer>
        <v-btn class="grey lighten-3" icon text @click="onRefuseCalling">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-container class="text-center">
        <v-avatar size="100">
          <img :src="calling.user.profile_photo_path" />
        </v-avatar>
        <div class="font-weight-bold">
          {{ calling.user.name }} {{ $t('IsCallingYou') }}
        </div>
        <div class="text-caption">{{ $t('CallWillStartAfterYouAnswer') }}</div>
      </v-container>
      <v-card-actions>
        <v-spacer />
        <v-btn
          text
          class="danger--text text-capitalize"
          @click="onRefuseCalling"
        >
          {{ $t('Refuse') }}
        </v-btn>
        <v-btn
          text
          class="primary--text text-capitalize"
          :to="
            localePath({
              name: 'call-call_id',
              params: { call_id: calling.call_id }
            })
          "
        >
          <v-icon class="mr-3">mdi-phone</v-icon>
          {{ $t('Answer') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { v4 as uuidv4 } from 'uuid'
export default {
  data() {
    return {}
  },
  methods: {
    onAnswerCalling() {
      this.$router.push(
        this.localePath({
          name: 'call-call_id',
          params: { call_id: this.calling.call_id }
        })
      )
    },
    onRefuseCalling() {
      this.$store.commit('message/SET_CALLING_USER', null)
    }
  },
  computed: {
    ...mapGetters('message', ['calling']),
    ...mapGetters('user', ['currentUser'])
  }
}
</script>
<style lang="scss" scoped>
.calling-container {
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: 200;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.2);
}
</style>
