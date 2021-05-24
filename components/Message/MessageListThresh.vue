<template>
  <div class="pa-2" v-if="threshes.length && !loading">
    <template v-for="room in threshes">
      <v-hover v-slot:default="{ hover }" :key="`room-${room.id}`">
        <div class="thresh-button">
          <v-btn
            block
            height="5rem"
            class="text-none"
            text
            active-class="primary--text"
            :to="
              localePath({
                name: 'messages-room_id',
                params: { room_id: room.id }
              })
            "
          >
            <template v-if="room.type === 'private'">
              <v-list-item-icon>
                <v-badge
                  bordered
                  bottom
                  color="success"
                  dot
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
                  :color="
                    room.represent.user.online_status.status
                      ? 'success'
                      : 'grey'
                  "
                  dot
                  offset-x="12"
                  offset-y="12"
                >
                  <v-avatar class="avatar-outlined">
                    <v-img
                      :src="room.represent.user.profile_photo_path"
                    ></v-img>
                  </v-avatar>
                </v-badge>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title class="font-weight-bold black--text">
                  {{ room.represent.user.name }}
                </v-list-item-title>
              </v-list-item-content>
            </template>
          </v-btn>
          <v-btn
            class="thresh-option-button"
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
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters('thresh', ['threshes']),
    ...mapGetters('user', ['currentUser'])
  },
  methods: {},
  props: ['loading'],
  methods: {
    onClickOption(value) {
      console.log(value)
    }
  }
}
</script>

<style lang="scss">
.thresh-button {
  position: relative;
  .thresh-option-button {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    z-index: 10;
  }
}
</style>
