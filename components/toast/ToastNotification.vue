<template>
  <div class="toast-notification">
    <v-fade-transition>
      <v-slide-x-reverse-transition>
        <v-card
          width="300"
          :color="color"
          class="white--text pa-2 rounded-lg text-caption"
          v-if="toast"
          outlined
        >
          <div class="text-body-1">
            {{ title }}
          </div>
          <v-btn
            icon
            text
            x-small
            class="toast-notification-button"
            @click="toast = false"
          >
            <v-icon color="white">mdi-close</v-icon>
          </v-btn>
          {{ content }}
        </v-card>
      </v-slide-x-reverse-transition>
    </v-fade-transition>
  </div>
</template>
<script>
export default {
  data() {
    return {
      toast: true
    }
  },
  props: {
    color: {
      type: String,
      default: 'dark'
    },
    delay: {
      type: Number,
      default: 3000
    },
    title: String,
    content: String
  },
  methods: {},
  mounted() {
    setTimeout(() => {
      this.toast = false
    }, this.delay)
  }
}
</script>
<style lang="scss" scoped>
.toast-notification {
  position: relative;
  margin-top: 5px;
  margin-right: 5px;
  .toast-notification-button {
    position: absolute;
    top: 10px;
    right: 10px;
  }
}
</style>
