<template>
  <div>
    <nuxt-link
      v-if="!image"
      :to="
        localePath({
          name: 'user-url',
          params: { url: user.url }
        })
      "
      class="text-capitalize nuxt-link-active"
      v-slot="{ href, navigate }"
    >
      <a
        @mouseover="onMouseOver"
        @mouseleave="onMouseLeave"
        :class="
          `font-weight-black nuxt-link-active ${
            hover ? '' : 'text-decoration-none'
          }`
        "
        :href="href"
        @click="navigate"
      >
        {{ user.name }}
      </a>
    </nuxt-link>
    <v-btn
      v-else
      @mouseover="onMouseOver"
      @mouseleave="onMouseLeave"
      :to="
        localePath({
          name: 'user-url',
          params: { url: user.url }
        })
      "
      class="text-capitalize"
      icon
    >
      <v-avatar class="avatar-outlined" size="40">
        <img :src="user.profile_photo_path" :alt="user.name" />
      </v-avatar>
    </v-btn>
    <v-card
      v-if="hovering && info"
      @mouseover="hoverCard = true"
      @mouseleave="hoverCard = false"
      max-width="344"
      class="card-user"
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
    }
  },
  computed: {
    ...mapGetters('user', ['currentUser']),
    hovering: function() {
      if (this.hover || this.hoverCard) return true
      else return false
    }
  },
  data() {
    return {
      hover: false,
      hoverCard: false,
      info: null,
      error: null
    }
  },
  methods: {
    async onMouseOver() {
      if (this.info) {
        this.hover = true
        return
      }
      try {
        const response = await axios.get(`/v1/user/${this.user.id}/get`)
        this.info = response.data.data
      } catch (err) {
        this.error = err.toString()
      }
      this.hover = true
    },
    onMouseLeave() {
      const _this = this
      setTimeout(function() {
        _this.hover = false
      }, 100)
    }
  }
}
</script>

<style>
.card-user {
  z-index: 999;
  position: fixed;
}

.nuxt-link-active {
  color: red;
}
</style>
