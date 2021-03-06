<template>
  <v-dialog
    v-model="dialog"
    scrollable
    class="rounded-lg"
    persistent
    max-width="500"
  >
    <v-card v-if="!selectPrivacy" :loading="loading">
      <v-card-title>
        {{ $t('create_post.writeSt') }}
        <v-spacer />
        <v-btn icon @click="$emit('close-dialog')">
          <v-icon color="dark">mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-divider />
      <v-toolbar flat dense class="my-2">
        <v-avatar size="45" class="avatar-outlined">
          <img :src="currentUser.profile_photo_path" :alt="currentUser.name" />
        </v-avatar>
        <v-list-item-content class="ml-3">
          <v-list-item-title>
            {{ currentUser.name }}
          </v-list-item-title>

          <v-list-item-subtitle>
            <v-btn
              @click="selectPrivacy = true"
              class="text-caption-2 text-capitalize grey lighten-2"
              x-small
              rounded-lg
            >
              <v-icon small class="mr-2">{{ currentPrivacy.icon }}</v-icon>
              {{ currentPrivacy.text }}
              <v-icon class="ml-2">mdi-menu-down</v-icon>
            </v-btn>
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-toolbar>
      <v-card-text>
        <v-row>
          <v-textarea
            v-model="content"
            auto-grow
            label="What are you thinking?"
            rows="1"
            flat
            solo
            clearable
            clear-icon="mdi-close"
          ></v-textarea>
        </v-row>
        <v-row v-if="url.length">
          <v-img
            class="ma-1"
            width="45%"
            v-for="src in url"
            :key="src"
            :src="src"
          />
        </v-row>
      </v-card-text>
      <v-divider></v-divider>

      <v-card-actions>
        <v-card outlined class="rounded-lg" width="100%">
          <v-card-actions class="font-weight-bold">
            {{ $t('create_post.add') }}
            <v-spacer />
            <v-file-input
              accept="image/png, image/jpeg, image/bmp, image/gif"
              prepend-icon="mdi-folder-multiple-image"
              hide-input
              hide-details
              dense
              label="Avatar"
              multiple
              v-model="images"
              @change="onFileChange"
            ></v-file-input>
          </v-card-actions>
        </v-card>
      </v-card-actions>

      <v-card-actions>
        <v-btn
          color="primary"
          :disabled="!content && !images.length"
          class="text-capitalize"
          block
          @click="onPost"
        >
          {{ $t('create_post.post') }}
        </v-btn>
      </v-card-actions>
    </v-card>
    <v-card v-else>
      <v-toolbar>
        <v-btn icon @click="selectPrivacy = false">
          <v-icon color="dark">mdi-arrow-left</v-icon>
        </v-btn>
        <v-toolbar-title class="text-center text-h6 font-weight-black"
          >{{ $t('create_post.selectPrivacy') }}
        </v-toolbar-title>
      </v-toolbar>
      <v-container class="text-caption">
        <div class="text-body-1 font-weight-bold">
          {{ $t('create_post.whoSeen') }}
        </div>
        <div v-if="currentPrivacy.value === 'private'">
          {{ $t('create_post.seenPrivate') }}
        </div>
        <div v-else-if="currentPrivacy.value === 'public'">
          {{ $t('create_post.seenPublic') }}
        </div>
        <div v-else-if="currentPrivacy.value === 'friend'">
          {{ $t('create_post.seenFriend') }}
        </div>
        <div v-else>
          {{ $t('create_post.seenBlocked') }}
        </div>
      </v-container>
      <v-container>
        <v-btn-toggle
          mandatory
          color="primary"
          v-model="currentPrivacy.value"
          class="btn-toggle"
          block
        >
          <v-btn
            v-for="privacy in privacys"
            :key="privacy.value"
            :value="privacy.value"
            block
            class="text-capitalize mb-2"
            text
            x-large
            @click="setPrivacy(privacy)"
            outlined
          >
            <v-icon
              :color="privacy.value === currentPrivacy.value ? 'primary' : null"
              class="mr-2"
              >{{ privacy.icon }}</v-icon
            >
            {{ privacy.text }}
            <v-spacer></v-spacer>
            <v-icon
              :color="privacy.value === currentPrivacy.value ? 'primary' : null"
              class=""
            >
              {{
                privacy.value === currentPrivacy.value
                  ? 'mdi-circle-slice-8'
                  : 'mdi-checkbox-blank-circle-outline'
              }}
            </v-icon>
          </v-btn>
        </v-btn-toggle>
      </v-container>
      <v-card-actions>
        <v-container>
          <v-btn
            color="primary"
            @click="selectPrivacy = false"
            block
            class="text-capitalize"
          >
            Ok
          </v-btn>
        </v-container>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  computed: mapGetters('user', ['currentUser']),
  props: ['dialog'],
  methods: {
    ...mapActions('post', ['createPost']),
    test() {
      console.log(this.images)
    },
    async onPost() {
      this.loading = true
      this.error = null
      try {
        var formData = new FormData()
        if (this.images.length) {
          this.images.forEach(function(image) {
            formData.append('files[]', image)
          })
        }
        if (this.content) formData.append('content', this.content)
        formData.append('privacy', this.currentPrivacy.value)
        await this.createPost(formData)
      } catch (err) {
        this.error = err.toString()
        console.log(err.response)
      }

      this.visible = 'public'
      this.content = null
      this.images = this.url = []
      this.loading = false
      this.$emit('close-dialog')
    },

    setPrivacy(privacy) {
      this.currentPrivacy = privacy
      this.tab = privacy.value
    },
    onFileChange: function() {
      // Reference to the DOM input element
      // Ensure that you have a file before attempting to read it
      if (this.images.length) {
        const vm = this
        // create a new FileReader to read this image and convert to base64 format
        this.images.forEach(function(image) {
          var reader = new FileReader()
          // Define a callback function to run, when FileReader finishes its job
          reader.onload = e => {
            // Note: arrow function used here, so that "this.imageData" refers to the imageData of Vue component
            // Read image as base64 and set to imageData
            vm.url.push(e.target.result)
          }
          // Start the reader job - read file as a data url (base64 format)
          reader.readAsDataURL(image)
        })
      }
    }
  },
  data() {
    return {
      writePost: false,
      tab: 'private',
      loading: false,
      error: null,
      chooseVisible: false,
      visible: 'public',
      content: null,
      imageUrl: null,
      addImage: false,
      selectPrivacy: false,
      currentPrivacy: {
        icon: 'mdi-earth',
        text: `${this.$t('create_post.public')}`,
        value: 'public'
      },
      privacys: [
        {
          icon: 'mdi-earth',
          text: `${this.$t('create_post.public')}`,
          value: 'public'
        },
        {
          icon: 'mdi-lock',
          text: `${this.$t('create_post.private')}`,
          value: 'private'
        },
        {
          icon: 'mdi-account-group',
          text: `${this.$t('create_post.friend')}`,
          value: 'friend'
        }
      ],
      images: [],
      url: []
    }
  }
}
</script>

<style scoped>
.btn-toggle {
  flex-direction: column;
  width: 500px;
}
</style>
