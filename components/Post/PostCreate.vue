<template>
  <v-card
    @mouseover="hover = true"
    @mouseleave="hover = false"
    :class="`rounded-lg hover-up-half elevation-${elevation}`"
    outlined
    v-if="currentUser"
  >
    <div class="header-card">
      <div class="header-card-avatar">
        <v-avatar size="45" class="ml-1 avatar-outlined">
          <img :src="currentUser.profile_photo_path" :alt="currentUser.name" />
        </v-avatar>
      </div>
      <div class="header-card-button">
        <v-btn
          class="text-capitalize buttom-create-post"
          rounded
          @click="dialog = true"
          flat
          block
        >
          {{ content ? content : $t('create_post.writeSt') | shortenContent }}
        </v-btn>
      </div>
    </div>
    <v-divider class="mx-4"></v-divider>
    <v-row no-gutters class="pa-3">
      <v-col cols="4"> </v-col>

      <v-col cols="4">
        <v-btn class="text-capitalize" block rounded-lg text>
          <v-icon class="mr-2" color="success">mdi-image-multiple</v-icon>
          {{ $t('create_post.uploadImg') }}
        </v-btn></v-col
      >
      <v-col cols="4">
        <v-btn class="text-capitalize" block rounded-lg text>
          <v-icon class="mr-2" color="warning">mdi-image-multiple</v-icon>
          {{ $t('create_post.uploadImg') }}
        </v-btn>
      </v-col>
    </v-row>
    <v-dialog v-model="addImage" hide-overlay max-width="600px">
      <v-row>
        <v-container>
          <v-textarea
            clearable
            :label="$t('create_post.content')"
            v-model="imageUrl"
          ></v-textarea>
        </v-container>
      </v-row>
    </v-dialog>
    <post-create-dialog
      v-if="!loading"
      :dialog="dialog"
      @close-dialog="dialog = false"
      @update-content="onUpdateContent"
    ></post-create-dialog>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  props: ['loading'],
  data() {
    return {
      writePost: false,
      tab: 'private',
      chooseVisible: false,
      visible: 'public',
      content: '',
      imageUrl: null,
      addImage: false,
      selectPrivacy: false,
      dialog: false,
      hover: false,
      content: ''
    }
  },
  computed: {
    elevation() {
      return this.hover ? '12' : '3'
    },
    ...mapGetters('user', ['currentUser'])
  },
  methods: {
    onUpdateContent(e) {
      this.content = e
    }
  },
  filters: {
    shortenContent(value) {
      return value.length < 50 ? value : value.substring(0, 50) + ' ...'
    }
  }
}
</script>

<style scoped>
.btn-toggle {
  flex-direction: column;
  width: 500px;
}

.header-card {
  display: flex;
  padding: 10px;
}
.header-card .header-card-avatar {
  width: 60px;
}
.header-card .header-card-button {
  display: flex;
  width: calc(100% - 60px);
  justify-content: center;
  align-items: center;
}
</style>
