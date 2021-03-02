<template>
  <v-row
    v-if="message.user_id !== currentUser.id"
    class="mx-auto d-flex align-end"
  >
    <v-avatar class="mr-1 mt-1 avatar-outlined" size="30" v-if="same">
      <img :src="user.profile_photo_path" />
    </v-avatar>
    <v-responsive max-width="35" v-else> </v-responsive>
    <v-chip color="grey lighten-2" class="mt-1">{{ message.content }}</v-chip>
  </v-row>
  <v-row v-else justify="end" class="mx-auto d-flex align-end">
    <v-spacer />
    <v-chip color="blue" class="mr-2 mt-1">{{ message.content }} </v-chip>
  </v-row>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  props: ['message', 'same', 'user'],
  computed: {
    ...mapGetters('user', ['currentUser'])
  }
}
</script>

<style>
</style>
