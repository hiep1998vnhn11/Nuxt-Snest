<template>
  <div class="base-name-link">
    <nuxt-link
      v-if="!image"
      :to="
        localePath({
          name: 'index-user-url',
          params: { url: user.url }
        })
      "
      :class="
        `font-weight-black black--text nuxt-link-active ${
          hover ? '' : 'text-decoration-none'
        }`
      "
      custom
      tag="a"
    >
      <span @mouseover="onMouseOver" @mouseleave="onMouseLeave">
        {{ user.name }}
      </span>
    </nuxt-link>
    <v-btn
      v-else
      :to="
        localePath({
          name: 'index-user-url',
          params: { url: user.url }
        })
      "
      class="text-capitalize"
      icon
    >
      <v-avatar
        class="avatar-outlined"
        :size="size"
        @mouseover="onMouseOver"
        @mouseleave="onMouseLeave"
      >
        <img :src="user.profile_photo_path" :alt="user.name" />
      </v-avatar>
    </v-btn>
    <v-card
      v-if="hover && info"
      max-width="344"
      class="card-user rounded-lg"
      outlined
    >
      <v-container>
        <v-list-item>
          <v-list-item-avatar class="avatar-outlined" size="100">
            <v-img :src="user.profile_photo_path"></v-img>
          </v-list-item-avatar>

          <v-list-item-content>
            <div class="headline mb-4 text-capitalize font-weight-black">
              {{ user.name }}
            </div>
            <v-list-item-title class="mb-1">
              <v-icon>mdi-account-multiple</v-icon>
              {{ info.friends_count }} {{ $t('Friends') }}
            </v-list-item-title>
            <v-list-item-title>
              <v-icon>mdi-account-circle</v-icon>
              {{ $t('Infomation') }}
            </v-list-item-title>
            <v-list-item-subtitle>
              <span v-if="info.info.live_at && info.info.show_live_at">
                {{ info.info.live_at }}
              </span>
              <span v-if="info.info.from && info.info.show_from">
                {{ info.info.from }}
              </span>
              <span v-if="info.info.jobs.length && info.info.jobs[0].status">
                {{ info.info.jobs[0].details }} at
                {{ info.info.jobs[0].workspace }}
              </span>
              <span
                v-if="info.info.educates.length && info.info.educates[0].status"
              >
                {{ info.info.educates[0].details }} at
                {{ info.info.educates[0].school }}
              </span>
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-card-actions v-show="currentUser.id !== user.id">
          <v-btn class="text-capitalize" width="56%" outlined text>
            <v-icon>mdi-account-plus</v-icon>
            {{ $t('AddFriend') }}
          </v-btn>
          <v-btn class="text-capitalize" outlined text>
            <v-icon>mdi-facebook-messenger</v-icon>
          </v-btn>
          <v-btn class="text-capitalize" outlined text>
            <v-icon>mdi-information-variant</v-icon>
          </v-btn>
        </v-card-actions>
      </v-container>
    </v-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import axios from 'axios'
export default {
  props: {
    user: {
      type: Object,
      default: () => ({
        id: '3',
        url: 'hiep',
        name: 'Hiep'
      })
    },
    image: {
      type: Boolean,
      default: false
    },
    size: {
      type: Number,
      default: 40
    }
  },
  computed: {
    ...mapGetters('user', ['currentUser'])
  },
  data() {
    return {
      hover: false,
      info: null,
      error: null
    }
  },
  methods: {
    async onMouseOver() {
      this.hover = true
      if (this.info) return
      try {
        const response = await axios.get(`/v1/user/${this.user.id}/get`)
        this.info = response.data.data
      } catch (err) {
        this.error = err.toString()
      }
    },
    onMouseLeave() {
      this.hover = false
    }
  }
}
</script>

<style lang="scss">
.base-name-link {
  position: relative;
  .card-user {
    z-index: 999;
    position: fixed;
    transition: 0.5s;
  }
}
</style>
