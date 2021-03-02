<template>
  <v-card class="rounded-lg mt-3">
    <v-card-title class="font-weight-bold">
      {{ $t('profile.Friends') }}
      <v-card-subtitle>{{ user.friends_count }} friends</v-card-subtitle>
      <v-spacer></v-spacer>
      <v-btn text class="primary--text text-capitalize">
        {{ $t('profile.More') }}
      </v-btn>
    </v-card-title>
    <v-container class="mt-n10">
      <v-row>
        <v-col
          v-for="friend in user.friends"
          :key="`friend-${friend.friend_id}`"
          cols="3"
          class="text-center"
        >
          <nuxt-link
            :to="
              localePath({
                name: 'user-url',
                params: { url: friend.user_friend.url }
              })
            "
          >
            <v-avatar size="93" class="rounded-lg avatar-outlined">
              <v-img
                width="93"
                :src="friend.user_friend.profile_photo_path"
              ></v-img>
            </v-avatar>
          </nuxt-link>
          <nuxt-link
            :to="
              localePath({
                name: 'user-url',
                params: { url: friend.user_friend.url }
              })
            "
            style="text-decoration: none; color: black;"
            class="font-weight-bold"
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
  props: ['user']
}
</script>

<style></style>
