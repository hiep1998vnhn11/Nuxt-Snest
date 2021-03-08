<template>
  <v-list v-if="currentUser && !loading">
    <template v-for="room in threshes">
      <v-hover v-slot:default="{ hover }" :key="`room-${room.id}`">
        <div
          link
          :to="
            localePath({
              name: 'messages-room_id',
              params: { room_id: room.id }
            })
          "
          active-class="blue--text"
        >
          <template v-if="room.type === 'private'">
            <v-list-item-icon>
              <v-badge
                bordered
                bottom
                color="deep-purple accent-4"
                dot
                :value="currentUser.online_status.status"
                offset-x="12"
                offset-y="12"
              >
                <v-avatar class="avatar-outlined">
                  <v-img :src="currentUser.profile_photo_path"></v-img>
                </v-avatar>
              </v-badge>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title
                class="font-weight-bold text-capitalize black--text"
              >
                {{ currentUser.name }}
              </v-list-item-title>
              <v-list-item-subtitle>
                {{ currentUser.name }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </template>
          <template v-else-if="room.type === 'with'">
            <v-list-item-icon>
              <v-badge
                bordered
                bottom
                color="deep-purple accent-4"
                dot
                :value="room.represent.user.online_status.status"
                offset-x="12"
                offset-y="12"
              >
                <v-avatar class="avatar-outlined">
                  <v-img :src="room.represent.user.profile_photo_path"></v-img>
                </v-avatar>
              </v-badge>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="font-weight-bold black--text">
                {{ room.represent.user.name }}
              </v-list-item-title>
            </v-list-item-content>
          </template>
          <v-btn
            icon
            text
            outlined
            v-show="hover"
            @click="onClickOption(room.id)"
          >
            <v-icon>mdi-dots-horizontal</v-icon>
          </v-btn>
        </div>
      </v-hover>
    </template>
  </v-list>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters('thresh', ['threshes']),
    ...mapGetters('user', ['currentUser'])
  },
  methods: {},
  props: ['loading']
}
</script>

<style></style>
