<template>
  <v-card>
    <v-skeleton-loader
      v-if="loading"
      type="image,article ,table-row"
    ></v-skeleton-loader>
    <v-container v-else-if="!!user">
      <v-card justify="center" class="mx-auto" max-width="100%" height="400">
        <v-img class="align-end" width="100%" height="400" :src="background">
          <v-row>
            <v-col cols="4">
              <profile-change-background
                :avatar="user.profile_photo_path"
                v-if="current"
                @changed-background="$emit('changed-background')"
              ></profile-change-background>
            </v-col>
            <v-col cols="4" class="text-center">
              <v-avatar size="150" class="avatar-outlined">
                <img :src="user.profile_photo_path" />
              </v-avatar>
            </v-col>
            <v-col cols="4">
              <v-tooltip bottom v-if="current">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    icon
                    v-bind="attrs"
                    v-on="on"
                    class="icon-avatar-header"
                    @click="changeAvatarDialog = true"
                  >
                    <v-avatar
                      size="30"
                      class="grey lighten-2 icon-avatar-outlined"
                    >
                      <v-icon color="black">mdi-camera</v-icon>
                    </v-avatar>
                  </v-btn>
                </template>
                <span>Change avatar</span>
              </v-tooltip>
            </v-col>
          </v-row>
        </v-img>
      </v-card>
      <div class="text-center text-h4 mt-3 text-capitalize font-weight-bold">
        {{ user.name }}
      </div>
      <div class="text-center">
        <div v-if="user.info.story">
          {{ user.info.story }}
        </div>
        <a
          v-if="current"
          @click="
            changeStory = true
            story = user.info.story ? user.info.story : ''
          "
        >
          <p v-if="!user.info.story">Create your story</p>
          <p v-else>Change</p>
        </a>
        <v-card
          :loading="loadingChangeStory"
          max-width="400"
          class="mx-auto"
          v-if="changeStory"
        >
          <v-container>
            <v-textarea
              rows="3"
              outlined
              name="input-7-4"
              label="Description about you"
              v-model="story"
              counter="105"
              :rules="[v => v.length <= 105 || 'Too long']"
            />
          </v-container>
          <v-card-actions>
            <v-spacer />
            <v-btn
              text
              outlined
              class="text-capitalize"
              small
              @click="
                changeStory = false
                story = ''
              "
            >
              Cancel
            </v-btn>
            <v-btn
              text
              class="text-capitalize primary"
              @click="onChangeStory"
              small
            >
              Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </div>

      <v-divider></v-divider>
      <v-toolbar class="elevation-0" dense>
        <v-btn
          large
          text
          class="text-capitalize mr-2 mt-3"
          :to="localePath({ name: 'index-user-url' })"
          active-class="primary--text"
          exact
        >
          {{ $t('profile.Posts') }}
        </v-btn>
        <v-btn
          large
          text
          class="text-capitalize mr-2 mt-3"
          :to="localePath({ name: 'index-user-url-about' })"
          active-class="primary--text"
        >
          {{ $t('profile.About') }}
        </v-btn>
        <v-btn
          large
          text
          class="text-capitalize mt-3 mr-2"
          :to="localePath({ name: 'index-user-url-friend' })"
          active-class="primary--text"
        >
          {{ $t('profile.Friends') }}
        </v-btn>

        <profile-more-button></profile-more-button>

        <v-spacer></v-spacer>
        <profile-edit v-if="current" />
        <v-btn
          :loading="loadingAddFriend"
          :disabled="loadingAddFriend"
          v-else-if="user.friend_status === 0"
          outlined
          class="text-capitalize mt-3 ml-2"
          text
          @click="onAddFriend"
        >
          <v-icon class="mr-2">mdi-account-plus</v-icon>
          {{ $t('profile.AddFriend') }}
        </v-btn>
        <v-btn
          :loading="loadingAddFriend"
          :disabled="loadingAddFriend"
          v-else-if="user.friend_status === 1"
          outlined
          class="text-capitalize mt-3 ml-2"
          text
          :to="localePath({ name: 'Message' })"
        >
          <v-icon class="mr-2">mdi-account-cancel</v-icon>
          Chat
        </v-btn>
        <v-btn
          disabled
          v-else-if="user.friend_status === 2"
          outlined
          class="text-capitalize mt-3 ml-2"
          text
        >
          <v-icon class="mr-2">mdi-account-cancel</v-icon>
          You had blocked this user
        </v-btn>
        <v-btn
          disabled
          v-else-if="user.friend_status === 3"
          outlined
          class="text-capitalize mt-3 ml-2"
          text
        >
          <v-icon class="mr-2">mdi-account-cancel</v-icon>
          You had been blocked
        </v-btn>
        <v-btn
          :loading="loadingAddFriend"
          :disabled="loadingAddFriend"
          v-else-if="user.friend_status === 4"
          outlined
          class="text-capitalize mt-3 ml-2"
          text
          @click="onCancelFriend"
        >
          <v-icon class="mr-2">mdi-account-cancel</v-icon>
          Cancel invitation
        </v-btn>
        <v-btn
          :loading="loadingAddFriend"
          :disabled="loadingAddFriend"
          v-else
          outlined
          class="text-capitalize mt-3 ml-2"
          text
          @click="onAcceptFriend"
        >
          <v-icon class="mr-2">mdi-account-cancel</v-icon>
          Accept invitation friend
        </v-btn>
        <v-tooltip v-if="current" bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              outlined
              v-bind="attrs"
              v-on="on"
              icon
              text
              class="ml-2 mt-3"
            >
              <v-icon>mdi-eye</v-icon>
            </v-btn>
          </template>
          <span>View mode</span>
        </v-tooltip>
        <v-tooltip v-else bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              outlined
              v-bind="attrs"
              v-on="on"
              icon
              text
              class="ml-2 mt-3"
            >
              <v-icon>mdi-facebook-messenger</v-icon>
            </v-btn>
          </template>
          <span>Message</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              outlined
              v-bind="attrs"
              v-on="on"
              icon
              text
              class="ml-2 mt-3"
            >
              <v-icon>mdi-magnify</v-icon>
            </v-btn>
          </template>
          <span>Search on this personal page</span>
        </v-tooltip>
        <profile-more-icon :current="current"></profile-more-icon>
      </v-toolbar>
    </v-container>
    <v-dialog v-model="changeAvatarDialog" width="600" persistent>
      <v-card>
        <v-card-title class="font-weight-bold">
          <v-spacer></v-spacer>
          Update your avatar
          <v-spacer></v-spacer>
          <v-btn
            icon
            class="grey lighten-2"
            @click="file ? (dialog = true) : (changeAvatarDialog = false)"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-row>
            <v-col class="ml-1" cols="5">
              <v-btn
                class="text-capitalize"
                text
                outlined
                block
                color="primary lighten-2"
                @click="uploadAvatarDialog = true"
              >
                <v-icon class="mr-2">mdi-plus</v-icon>
                Upload image
              </v-btn>
            </v-col>
            <v-col cols="5">
              <v-btn class="text-capitalize" block text outlined>
                <v-icon class="mr-2">mdi-image</v-icon>
                Create frame
              </v-btn>
            </v-col>
            <v-col>
              <v-btn text outlined>
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-btn block class="blue--text text-capitalize"> More </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog max-width="800" v-model="uploadAvatarDialog">
      <v-card v-if="!avatarPreview" :loading="loadingAvatar">
        <v-card-title>
          <v-spacer />
          Upload image to change your avatar
          <v-spacer />
          <v-btn
            icon
            class="grey ligthen-2"
            @click="
              $refs.vueavatar || image
                ? (dialog = true)
                : (uploadAvatarDialog = false)
            "
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider />
        <v-container>
          Select your image to upload:

          <v-row class="mx-auto">
            <vue-avatar
              :width="250"
              :height="250"
              :rotation="rotation"
              :borderRadius="125"
              :scale="scale"
              ref="vueavatar"
              @vue-avatar-editor:image-ready="onImageReady"
              class="mx-auto"
            >
            </vue-avatar>

            <v-avatar size="250" class="mx-auto">
              <v-img :src="avatarPreviewSrc" />
            </v-avatar>
          </v-row>
          <v-slider
            v-model="scale"
            append-icon="mdi-plus"
            prepend-icon="mdi-minus"
            hint="Scroll to select scale of image"
            :max="3"
            :min="1"
            @click:append="zoomIn"
            @click:prepend="zoomOut"
            step="0.05"
          ></v-slider>
          <v-slider
            v-model="rotation"
            hint="Scroll to select rotation of image"
            append-icon="mdi-arrow-top-right"
            prepend-icon="mdi-arrow-top-left"
            @click:append="rotateLeft"
            @click:prepend="rotateRight"
            :max="360"
            :min="-360"
          ></v-slider>
        </v-container>
        <v-divider />
        <v-card-actions>
          <v-btn small text class="text-capitalize" @click="saveClicked">
            Preview
          </v-btn>
          <v-btn
            text
            small
            class="text-capitalize"
            @click="avatarPreview = true"
            :disabled="!avatarPreviewSrc"
          >
            Preview in your presonal page
          </v-btn>
          <v-spacer />
          <v-btn
            v-if="!!image"
            @click="changeAvatar"
            text
            class="primary text-capitalize"
          >
            Save
          </v-btn>
          <v-btn
            v-else
            @click="changeAvatar"
            text
            class="primary text-capitalize"
          >
            Cancel
          </v-btn>
        </v-card-actions>
      </v-card>
      <v-card v-else>
        <v-card-title>
          <v-btn @click="avatarPreview = false" icon class="grey lighten-2">
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
          <v-spacer />
          Preview your personal page before your change
          <v-spacer />
        </v-card-title>
        <v-container>
          <v-img
            class="align-end"
            width="800px"
            height="350px"
            :src="user.info.profile_background_path"
          >
            <v-row>
              <v-col cols="4"> </v-col>
              <v-col cols="4" class="text-center">
                <v-avatar size="150" class="avatar-outlined">
                  <img :src="avatarPreviewSrc" />
                </v-avatar>
              </v-col>
            </v-row>
          </v-img>
        </v-container>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialog" persistent max-width="500">
      <v-card>
        <v-card-title class="font-weight-bold">
          Remove this change?
          <v-spacer></v-spacer>
          <v-btn icon class="grey lighten-2" @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text> Are you sure about discard this change? </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            class="text-capitalize primary--text"
            text
            @click="dialog = false"
          >
            Cancel
          </v-btn>
          <v-btn class="primary text-capitalize" @click="onRemoveChange">
            Agree
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
import axios from 'axios'
import { VueAvatar } from 'vue-avatar-editor-improved'

export default {
  props: ['user', 'loading'],
  data() {
    return {
      model: 'tab-2',
      changeAvatarDialog: false,
      rules: [
        value =>
          !value ||
          value.size < 20000000 ||
          'Avatar size should be less than 20 MB!'
      ],
      file: null,
      image: null,
      dialog: false,
      changeStory: false,
      loadingChangeStory: false,
      loadingAvatar: false,
      error: null,
      story: '',
      rotation: 0,
      scale: 1,
      uploadAvatarDialog: false,
      avatarPreviewSrc: null,
      avatarPreview: false,
      loadingAddFriend: false,
      addFriendStatus: false
    }
  },
  components: {
    VueAvatar
  },
  computed: {
    background() {
      return this.user.info.profile_background_path
        ? this.user.info.profile_background_path
        : 'https://i.pinimg.com/originals/3b/8a/d2/3b8ad2c7b1be2caf24321c852103598a.jpg'
    },
    current() {
      if (this.user && this.currentUser) {
        return this.user.id === this.currentUser.id
      } else return false
    },
    displayStory() {
      return true
    },
    ...mapGetters('user', ['currentUser']),
    ...mapGetters('socket', ['socket'])
  },
  methods: {
    onRemoveChange() {
      this.file = this.image = this.avatarPreviewSrc = null
      this.dialog = this.changeAvatarDialog = this.$refs.vueavatar = this.avatarPreview = this.uploadAvatarDialog = false
    },
    createImage() {
      this.url = URL.createObjectURL(this.file)
      let reader = new FileReader()
      let vm = this
      reader.onload = e => {
        vm.image = e.target.result
      }
      reader.readAsDataURL(vm.file)
    },
    async onChangeStory() {
      if (this.story !== this.user.info.story) {
        this.loadingChangeStory = true
        const url = '/v1/user/update_profile'
        const params = this.story
          ? { story: this.story, story_privacy: 'public' }
          : { story_privacy: 'public' }
        try {
          await axios.post(url, params)
          this.$emit('changed-avatar')
        } catch (err) {}
        this.loadingChangeStory = false
        this.changeStory = false
      }
    },
    saveClicked: function saveClicked() {
      this.image = this.$refs.vueavatar.getImageScaled()
      this.avatarPreviewSrc = this.image.toDataURL()
    },
    async onAddFriend() {
      this.error = null
      this.loadingAddFriend = true
      try {
        const url = '/v1/user/handle_friend'
        const params = {
          user_url: this.user.url,
          relationship: 'friend'
        }
        const response = await axios.post(url, params)
        this.addFriendStatus = true
        this.$emit('changed-status-friend-added')
        this.socket.emit('requestAddFriend', {
          userId: this.user.id,
          requestUserId: this.currentUser.id,
          data: response.data.data
        })
      } catch (err) {
        this.error = err.toString()
      }
      this.loadingAddFriend = false
    },
    async changeAvatar() {
      const vm = this
      this.error = null
      this.loadingAvatar = true
      this.image.toBlob(async function(blob) {
        try {
          var formData = new FormData()
          formData.append('image', blob)
          await axios.post('/v1/user/upload_avatar', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              Accept: 'application/json'
            }
          })
          vm.image = null
          vm.$emit('changed-avatar')
        } catch (error) {
          vm.error = error
        }
        vm.loadingAvatar = false
        vm.changeAvatarDialog = false
        vm.uploadAvatarDialog = false
        vm.image = vm.avatarPreviewSrc = vm.file = null
      })
    },
    async onAcceptFriend() {
      this.loadingAddFriend = true
      try {
        let url = `/v1/user/friend/${this.user.friend_id}/accept`
        await axios.post(url)
        this.$emit('changed-status-friend-accepted')
      } catch (err) {
        this.error = err.toString()
      }
      this.loadingAddFriend = false
    },
    async onCancelFriend() {
      this.loadingAddFriend = true
      try {
        let url = `/v1/user/friend/${this.user.friend_id}/cancel`
        await axios.post(url)
        this.$emit('changed-status-friend-denied')
      } catch (err) {
        this.error = err.toString()
      }
      this.loadingAddFriend = false
    },
    onImageReady: function onImageReady() {
      this.scale = 1
      this.rotation = 0
    },
    zoomOut() {
      this.scale = this.scale - 0.25 || 1
    },
    zoomIn() {
      this.scale = this.scale + 0.25 || 3
    },
    rotateLeft() {
      this.rotation = this.rotation + 90
    },
    rotateRight() {
      this.rotation = this.rotation - 90
    }
  }
}
</script>

<style>
.avatar-outlined-thick {
  border: thick solid rgba(255, 255, 255, 0) !important;
}

.icon-avatar-outlined {
  border: thin solid rgba(0, 0, 0, 0.12) !important;
}

.icon-avatar-header {
  position: relative;
  top: 70%;
  left: -50%;
}

.card-backround-option {
  position: relative;
  top: -17px;
}

.icon-background-header {
  position: relative;
  top: 120px;
}
</style>
