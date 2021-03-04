<template>
  <v-container
    v-if="!friends.length"
    class="text-center text-h5 text--disabled"
  >
    <span>
      {{ $t('profile.HaveNoFriend') }}
    </span>
  </v-container>
  <v-row v-else>
    <v-col
      cols="12"
      md="6"
      v-for="friend in friends"
      :key="`friend-${friend.id}`"
      style="position: relative;"
    >
      <v-card height="120">
        <v-row class="pa-6">
          <nuxt-link
            :to="
              localePath({
                name: 'index-user-url',
                params: { url: friend.user_friend.url }
              })
            "
          >
            <v-avatar size="80" class="rounded-lg avatar-outlined">
              <v-img :src="friend.user_friend.profile_photo_path" />
            </v-avatar>
          </nuxt-link>
          <div class="my-auto ml-4">
            <div class="font-weight-bold">
              <nuxt-link
                :to="
                  localePath({
                    name: 'index-user-url',
                    params: { url: friend.user_friend.url }
                  })
                "
                style="text-decoration: none; color: black;"
              >
                {{ friend.user_friend.name }}
              </nuxt-link>
            </div>
            <div>11 {{ $t('profile.MutualFriends') }}</div>
          </div>
          <div
            class="my-auto mx-auto"
            style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%);"
          >
            <v-btn
              class="text primary text-capitalize"
              @click="onShowFriendTransition"
            >
              {{ $t('Friend') }}
            </v-btn>
          </div>
          <div class="show-friend-bar">
            <v-expand-transition right>
              <v-card
                v-click-outside="{
                  handler: onClickOutsideWithConditional,
                  closeConditional
                }"
                v-show="expand"
                width="350"
                class="mx-auto"
              >
                <v-container v-if="loading">
                  <v-btn block disabled loading text></v-btn>
                </v-container>
                <div class="pa-2" v-else>
                  <v-btn text block class="text-capitalize" @click="onFavorite">
                    <v-icon v-if="favorite">mdi-star-outline</v-icon>
                    <v-icon v-else color="primary">mdi-star</v-icon>
                    <span class="ml-3">
                      {{ $t('profile.Favorite') }}
                    </span>
                    <v-spacer />
                  </v-btn>
                  <v-btn text block class="text-capitalize">
                    <v-icon>mdi-account-cancel-outline</v-icon>
                    <span class="ml-3">
                      {{ $t('profile.Unfriend') }}
                    </span>
                    <v-spacer />
                  </v-btn>
                </div>
              </v-card>
            </v-expand-transition>
          </div>
        </v-row>
      </v-card>
    </v-col>
  </v-row>
</template>
<script>
export default {
  data() {
    return {
      expand: false,
      loading: false,
      favorite: false
    }
  },
  props: ['friends'],
  methods: {
    onClickOutsideWithConditional() {
      this.expand = false
    },
    closeConditional(e) {
      return this.expand
    },
    onShowFriendTransition() {
      if (this.expand || this.loading) this.expand = !this.expand
      this.expand = this.loading = true
      const vm = this
      setTimeout(() => {
        vm.loading = false
      }, 3000)
    },
    onFavorite() {
      this.favorite = !this.favorite
    },
    onUnfriend() {}
  },
  created() {},
  mounted() {},
  computed: {}
}
</script>
<style scoped>
.show-friend-bar {
  position: absolute;
  z-index: 100;
  top: 100px;
  right: 10px;
}

.avatar-outlined {
  border: thin solid rgba(0, 0, 0, 0.12) !important;
}
</style>
