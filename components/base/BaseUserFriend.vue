<template>
  <v-card
    :class="`rounded-lg mt-3 hover-up elevation-${hover ? 24 : 3}`"
    @mouseleave="hover = false"
    @mouseenter="hover = true"
  >
    <v-card-title class="font-weight-bold">
      {{ $t('profile.Friends') }}
      <v-card-subtitle>
        {{ user.friends_count }} {{ $t('profile.Friends') }}
      </v-card-subtitle>
      <v-spacer></v-spacer>
      <v-btn text class="primary--text text-capitalize">
        {{ $t('SeeAllFriend') }}
      </v-btn>
    </v-card-title>
    <v-container class="mt-n10">
      <v-row>
        <v-col
          v-for="friend in user.friends"
          :key="`friend-${friend.friend_id}-link`"
          cols="3"
        >
          <nuxt-link
            :to="
              localePath({
                name: 'index-user-url',
                params: { url: friend.user_friend.url }
              })
            "
          >
            <v-avatar size="80" class="rounded-lg avatar-outlined">
              <v-img :src="friend.user_friend.profile_photo_path"></v-img>
            </v-avatar>
          </nuxt-link>
          <nuxt-link
            :to="
              localePath({
                name: 'index-user-url',
                params: { url: friend.user_friend.url }
              })
            "
            style="text-decoration: none; color: black;"
            class="font-weight-bold text-caption"
          >
            {{ friend.user_friend.name }}
          </nuxt-link>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
export default {
  props: ['user'],
  data: () => ({
    hover: false
  })
}
</script>

<style></style>
