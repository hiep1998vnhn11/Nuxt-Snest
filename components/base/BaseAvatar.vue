<template>
  <div :class="classes" class="base-avatar d-inline-flex">
    <v-avatar
      v-if="outlined"
      :color="color || 'grey lighten-3'"
      :size="outlineSize"
      :style="styles"
      class="base-avatar__outline"
      style="opacity: 0.4"
    >
      <img :src="src" />
    </v-avatar>

    <v-avatar
      :color="color || 'white'"
      :size="size"
      class="base-avatar__avatar"
      v-bind="$attrs"
      v-on="$listeners"
    >
      <base-icon v-if="icon" :dark="dark" :size="size / 2">
        {{ icon }}
      </base-icon>
    </v-avatar>
  </div>
</template>

<script>
export default {
  name: 'BaseAvatar',
  props: {
    color: String,
    dark: Boolean,
    icon: String,
    outlined: Boolean,
    size: {
      type: [Number, String],
      default: 56
    },
    src: String
  },

  data() {
    return {
      multiply: 6
    }
  },

  computed: {
    classes() {
      return [this.outlined && 'base-avatar--outlined']
    },
    outlineSize() {
      return Number(this.size) + this.size / this.multiply
    },
    styles() {
      const margin = this.size / (this.multiply * 2)
      return {
        // Aligns the outline content with the content
        margin: `-${margin}px 0 0 -${margin}px`
      }
    }
  }
}
</script>

<style scoped>
.base-avatar {
  border-radius: 50%;
  position: relative;
  overflow: visible;
}
.base-avatar__outline {
  position: absolute !important;
  left: 0;
  top: 0;
}
.base-avatar--outlined {
  background-color: #ffffff;
}
.base-avatar--outlined .base-avatar__avatar {
  border: thin solid rgba(0, 0, 0, 0.12) !important;
}
</style>
