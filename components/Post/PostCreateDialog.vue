<template>
  <v-dialog
    v-model="dialog"
    scrollable
    class="rounded-lg"
    persistent
    max-width="500"
  >
    <v-card :loading="loading">
      <v-card-title>
        <v-btn v-if="selectPrivacy" icon @click="selectPrivacy = false">
          <v-icon color="dark">mdi-arrow-left</v-icon>
        </v-btn>
        {{
          selectPrivacy
            ? $t('create_post.selectPrivacy')
            : $t('create_post.writeSt')
        }}
        <v-spacer />
        <v-btn v-if="!selectPrivacy" icon @click="$emit('close-dialog')">
          <v-icon color="dark">mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-divider />
      <v-container class="text-caption" v-if="selectPrivacy">
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
      <v-toolbar flat dense class="my-2" v-else>
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

      <v-container v-if="selectPrivacy">
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
      <v-container class="overflow-scroll-y" v-else>
        <v-textarea
          v-model="content"
          auto-grow
          label="What are you thinking?"
          rows="1"
          flat
          solo
          outlined
          clearable
          @change="$emit('update-content', content)"
          clear-icon="mdi-close"
        ></v-textarea>
        <v-row class="px-5" v-if="url.length">
          <div
            class="mt-3 create-post-image"
            v-for="(src, index) in url"
            :key="`create-post-image-${index}`"
          >
            <v-img
              :alt="`uploading-image-${index}`"
              transition="scale-transition"
              :src="src"
              width="100%"
              class="rounded-lg"
            >
            </v-img>
            <div class="create-post-image-default-slot white--text">
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    class="grey lighten-3"
                    icon
                    text
                    small
                    v-bind="attrs"
                    v-on="on"
                    @click="onRemoveFile(index)"
                  >
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </template>
                <span>{{ $t('RemoveImage') }}</span>
              </v-tooltip>
            </div>
          </div>
        </v-row>
      </v-container>
      <v-card-actions v-if="selectPrivacy">
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

      <v-card-actions v-else>
        <v-card outlined class="rounded-lg" width="100%">
          <v-card-actions class="font-weight-bold">
            {{ $t('create_post.add') }}
            <v-spacer />
            <v-btn text icon>
              <v-file-input
                chips
                class="success--text ml-2"
                solo
                accept="image/png, image/jpeg, image/bmp, image/gif"
                prepend-icon="mdi-folder-multiple-image"
                hide-input
                hide-details
                dense
                multiple
                v-model="inputImages"
                @change="onFileChange"
              ></v-file-input>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-card-actions>

      <v-card-actions>
        <v-btn
          color="primary"
          :disabled="!content && !inputImages.length"
          class="text-capitalize"
          block
          @click="onPost"
        >
          {{ $t('create_post.post') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  computed: mapGetters('user', ['currentUser']),
  props: ['dialog'],
  data() {
    const vm = this
    return {
      writePost: false,
      tab: 'private',
      loading: false,
      error: null,
      chooseVisible: false,
      visible: 'public',
      content: '',
      imageUrl: null,
      addImage: false,
      selectPrivacy: false,
      currentPrivacy: {
        icon: 'mdi-earth',
        text: vm.$t('create_post.public'),
        value: 'public'
      },
      privacys: [
        {
          icon: 'mdi-earth',
          text: vm.$t('create_post.public'),
          value: 'public'
        },
        {
          icon: 'mdi-lock',
          text: vm.$t('create_post.private'),
          value: 'private'
        },
        {
          icon: 'mdi-account-group',
          text: vm.$t('create_post.friend'),
          value: 'friend'
        }
      ],
      images: [],
      inputImages: [],
      url: []
    }
  },
  methods: {
    ...mapActions('post', ['createPost']),
    async onPost() {
      this.loading = true
      this.error = null
      try {
        var formData = new FormData()
        if (this.inputImages.length) {
          this.inputImages.forEach(function(image) {
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
      this.content = ''
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
      if (this.inputImages.length) {
        const vm = this
        // create a new FileReader to read this image and convert to base64 format
        this.inputImages.forEach(function(image) {
          vm.images.push(image)
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
    },
    onRemoveFile(index) {
      if (this.images[index] && this.url[index]) {
        //Remove element had index in array
        this.images.splice(index, 1)
        this.url.splice(index, 1)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.btn-toggle {
  flex-direction: column;
  width: 500px;
}

.create-post-image {
  border-radius: 10px;
  transition: 0.5s ease-in-out;
  width: 100%;
  min-height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  &:hover {
    transform: scale(1.05);
    transition: 0.5s ease-in-out;
    .create-post-image-default-slot {
      display: block;
    }
  }
  .create-post-image-default-slot {
    position: absolute;
    display: none;
    top: 5px;
    right: 5px;
    z-index: 2;
  }
}
</style>
