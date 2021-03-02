<template>
  <div>
    <v-btn
      block
      @click="expand = true"
      small
      class="icon-background-header text-capitalize ml-2"
    >
      <v-icon class="mr-2" color="black">mdi-camera</v-icon>
      Change background image
    </v-btn>
    <v-expand-transition>
      <v-card
        v-click-outside="{
          handler: onClickOutsideWithConditional,
          closeConditional
        }"
        v-show="expand"
        width="200"
        class="mx-auto"
      >
        <v-btn text block class="text-capitalize" @click="dialog = true">
          <v-icon class="mr-3">mdi-image-multiple-outline</v-icon>
          Select background
          <v-spacer />
        </v-btn>
        <v-btn text block class="text-capitalize" @click="dialog = true">
          <v-icon class="mr-3">mdi-cloud-upload-outline</v-icon>
          Upload
          <v-spacer />
        </v-btn>
        <v-btn text block class="text-capitalize" @click="removeDialog = true">
          <v-icon class="mr-3">mdi-trash-can-outline</v-icon>
          Remove
          <v-spacer />
        </v-btn>
      </v-card>
    </v-expand-transition>
    <v-dialog v-model="dialog" max-width="850">
      <v-card :loading="loading">
        <v-card-title class="font-weight-bold">
          <v-spacer />
          Upload your background
          <v-spacer />
          <v-btn
            icon
            class="grey lighten-2"
            @click="image ? (discardDialog = true) : (dialog = false)"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider />
        <v-container class="mx-auto">
          <v-row class="mx-auto">
            <vue-avatar
              :width="570"
              :height="250"
              :rotation="rotation"
              :borderRadius="0"
              :scale="scale"
              ref="background"
              @vue-avatar-editor:image-ready="onImageReady"
              class="mx-auto"
            >
            </vue-avatar>
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
            step="90"
          ></v-slider>
        </v-container>

        <v-divider />
        <v-card-actions>
          <v-btn class="text-capitalize" text @click="preview">
            Preview on your personal page
          </v-btn>
          (To upload background, you must preview first!)
          <v-spacer />
          <v-btn
            v-if="!!image"
            @click="uploadBackground"
            text
            class="text-capitalize primary"
          >
            Upload
          </v-btn>
          <v-btn
            text
            class="text-capitalize"
            @click="image ? (discardDialog = true) : (dialog = false)"
          >
            Cancel
          </v-btn>
        </v-card-actions>
        <v-dialog v-model="discardDialog" persistent max-width="500">
          <v-card>
            <v-card-title class="font-weight-bold">
              Remove this change?
              <v-spacer></v-spacer>
              <v-btn icon class="grey lighten-2" @click="discardDialog = false">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-card-title>
            <v-card-text>
              Are you sure about discard this change?
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                class="text-capitalize primary--text"
                text
                @click="discardDialog = false"
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
    </v-dialog>

    <v-dialog v-model="previewDialog" persistent max-width="900">
      <v-card>
        <v-card-title class="font-weight-bold">
          <v-btn icon class="grey lighten-2" @click="previewDialog = false">
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
          <v-spacer />
          This is your presonal page after your change
          <v-spacer></v-spacer>
        </v-card-title>
        <v-container>
          <v-img
            class="align-end"
            width="800px"
            height="350px"
            :src="backgroundPreviewSrc"
          >
            <v-row>
              <v-col cols="4"> </v-col>
              <v-col cols="4" class="text-center">
                <v-avatar size="150" class="avatar-outlined">
                  <img :src="avatar" />
                </v-avatar>
              </v-col>
            </v-row>
          </v-img>
        </v-container>
      </v-card>
    </v-dialog>

    <v-dialog v-model="removeDialog" persistent max-width="500">
      <v-card :loading="loadingRemove">
        <v-card-title class="font-weight-bold">
          Remove Background
          <v-spacer></v-spacer>
          <v-btn icon class="grey lighten-2" @click="removeDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          Are you sure about remove your background?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            class="text-capitalize primary--text"
            text
            @click="removeDialog = false"
          >
            Cancel
          </v-btn>
          <v-btn class="primary text-capitalize" @click="removeBackground">
            Agree
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import axios from 'axios'
import { VueAvatar } from 'vue-avatar-editor-improved'

export default {
  props: ['avatar'],
  components: {
    VueAvatar
  },
  methods: {
    onClickOutsideWithConditional() {
      this.expand = false
    },
    closeConditional(e) {
      return this.expand
    },
    onRemoveChange() {
      this.file = this.image = this.backgroundPreviewSrc = null
      this.discardDialog = false
      this.dialog = false
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
    async removeBackground() {
      this.loadingRemove = true
      this.removeError = null
      try {
        const url = '/v1/user/remove_background'
        await axios.post(url)
        this.emit('changed_background')
      } catch (err) {
        this.removeError = err.toString()
      }
      this.loadingRemove = false
      this.removeDialog = false
    },
    async uploadBackground() {
      const vm = this
      this.error = null
      this.loading = true
      this.image.toBlob(async function(blob) {
        try {
          var formData = new FormData()
          formData.append('image', blob)
          await axios.post('/v1/user/upload_background', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              Accept: 'application/json'
            }
          })
          vm.image = null
          vm.$emit('changed-background')
        } catch (error) {
          vm.error = error.toString()
        }
        vm.loading = false
        vm.dialog = false
        vm.image = vm.backgroundPreviewSrc = vm.file = null
      })
    },
    saveClicked: function saveClicked() {
      this.image = this.$refs.background.getImageScaled()
      this.backgroundPreviewSrc = this.image.toDataURL()
    },
    onImageReady: function onImageReady() {
      this.scale = 1
      this.rotation = 0
    },
    preview() {
      this.previewDialog = true
      this.saveClicked()
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
  },
  data() {
    return {
      expand: false,
      dialog: false,
      discardDialog: false,
      image: null,
      removeDialog: false,
      removeError: null,
      loadingRemove: false,
      loading: false,
      error: false,
      scale: 1,
      rotation: 0,
      backgroundPreviewSrc: null,
      previewDialog: false
    }
  }
}
</script>

<style>
.show-more-2 {
  position: fixed;
  z-index: 100;
}
</style>
