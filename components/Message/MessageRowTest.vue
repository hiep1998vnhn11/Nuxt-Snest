<template>
  <v-row v-if="message.user_id !== currentUser.id" class="mt-1" no-gutters>
    <v-col cols="2" v-if="same">
      <v-badge
        bordered
        bottom
        color="deep-purple accent-4"
        dot
        offset-x="10"
        offset-y="10"
        v-if="user.online_status.status"
      >
        <v-avatar size="30">
          <v-img :src="user.profile_photo_path"></v-img>
        </v-avatar>
      </v-badge>
      <v-avatar v-else size="30">
        <v-img :src="user.profile_photo_path"></v-img>
      </v-avatar>
    </v-col>
    <v-col cols="2" v-else></v-col>
    <v-chip color="grey lighten-2 ml-n2">
      {{ message.content }}
    </v-chip>
  </v-row>
  <v-row v-else no-gutters class="mt-1">
    <v-col cols="1">
      <v-btn icon small>
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>
    </v-col>
    <v-spacer />
    <v-chip color="primary">
      {{ message.content }}
    </v-chip>
  </v-row>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  props: {
    message: Object,
    user: Object,
    same: Boolean
  },
  computed: mapGetters('user', ['currentUser'])
}
</script>

<style></style>
