<template>
  <v-btn
    large
    text
    class="text-capitalize mt-3"
    active-class="primary--text"
    @click="expand = !expand"
  >
    {{ $t('profile.More') }}
    <v-icon>mdi-menu-down</v-icon>
    <div class="show-more">
      <v-expand-transition>
        <v-card
          v-click-outside="{
            handler: onClickOutsideWithConditional,
            closeConditional
          }"
          v-show="expand"
          width="250"
          class="mx-auto index-100"
        >
          <div class="ma-1">
            <v-btn
              :to="localePath({ name: 'index-user-url-image' })"
              text
              class="text-capitalize mb-2"
              block
              active-class="primary--text"
            >
              {{ $t('profile.Image') }}
              <v-spacer />
            </v-btn>
            <v-btn
              :to="localePath({ name: 'index-user-url-video' })"
              text
              class="text-capitalize mb-2"
              block
              active-class="primary--text"
            >
              {{ $t('profile.Videos') }}
              <v-spacer />
            </v-btn>
            <v-btn
              :to="localePath({ name: 'index-user-url-archive' })"
              text
              class="text-capitalize mb-2"
              block
              active-class="primary--text"
            >
              {{ $t('profile.Archive') }}
              <v-spacer />
            </v-btn>
            <v-btn
              :to="localePath({ name: 'index-user-url-archive' })"
              text
              class="text-capitalize mb-2"
              block
              active-class="primary--text"
            >
              {{ $t('profile.CheckIns') }}
              <v-spacer />
            </v-btn>
          </div>
        </v-card>
      </v-expand-transition>
    </div>
  </v-btn>
</template>

<script>
export default {
  methods: {
    onClickOutsideWithConditional() {
      this.expand = false
    },
    closeConditional(e) {
      return this.expand
    }
  },
  computed: {
    classes() {
      return this.expand ? 'primary--text blue lighten-5' : null
    }
  },
  data() {
    return {
      expand: false
    }
  }
}
</script>

<style>
.show-more {
  position: absolute;
  top: 30px;
  z-index: 1;
}
</style>
