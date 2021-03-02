<template>
  <v-dialog v-model="dialog" max-width="800" scrollable max-height="100%">
    <template v-slot:activator="{ on, attrs }">
      <v-btn text outlined v-bind="attrs" v-on="on" class="text-none mt-3">
        <v-icon class="mr-2 ml-n2">mdi-pencil</v-icon>
        {{ $t('profile.EditProfile') }}
      </v-btn>
    </template>

    <v-card class="text-h6 font-weight-bold">
      <v-card-title>
        <v-spacer />
        {{ $t('profile.EditProfile') }}
        <v-spacer />
        <v-btn icon class="grey lighten-3" @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-divider />

      <!-- Avatar -->
      <v-toolbar elevation="0">
        {{ $t('Avatar') }}
        <v-spacer />
        <v-btn class="primary--text text-none" text>
          {{ $t('Edit') }}
        </v-btn>
      </v-toolbar>
      <div class="text-center">
        <v-avatar size="150" class="avatar-outlined">
          <img :src="currentUser.profile_photo_path" />
        </v-avatar>
      </div>

      <!-- Cover photo -->
      <v-toolbar elevation="0">
        {{ $t('BackgroundImage') }}
        <v-spacer />
        <v-btn class="primary--text text-none" text>
          {{ $t('Edit') }}
        </v-btn>
      </v-toolbar>
      <div class="d-flex flex-column justify-space-between align-center">
        <v-card class="rounded-lg" width="500">
          <v-img
            width="500"
            :aspect-ratio="16 / 6"
            :src="currentUser.info.profile_background_path"
          />
        </v-card>
      </div>

      <!-- Story -->
      <v-toolbar elevation="0">
        {{ $t('Story') }}
        <v-spacer />
        <v-btn class="primary--text text-none" text>
          {{ $t('Edit') }}
        </v-btn>
      </v-toolbar>
      <div class="text-center text-body-1">
        {{ currentUser.info.story }}
      </div>

      <!-- Intro -->
      <v-toolbar elevation="0">
        {{ $t('CustomizeYourIntro') }}
        <v-spacer />
        <v-btn class="primary--text text-none" text>
          {{ $t('Edit') }}
        </v-btn>
      </v-toolbar>
      <div class="text-body-1">
        <span v-for="job in currentUser.info.jobs" :key="`job-${job.id}`">
          {{ job.company }}
        </span>
        <span
          v-for="edu in currentUser.info.educates"
          :key="`educate-${edu.id}`"
        >
          {{ edu.school }}
        </span>
      </div>
    </v-card>
  </v-dialog>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      dialog: false
    }
  },
  methods: {},
  created() {},
  mounted() {},
  computed: {
    ...mapGetters('user', ['currentUser'])
  }
}
</script>
<style scoped>
</style>
