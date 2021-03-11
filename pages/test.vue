<template>
  <v-fade-transition>
    <div class="chat-row" v-if="typing">
      <v-avatar class="mr-2 avatar-outlined" size="20" v-if="!current">
        <img :src="user.profile_photo_path" />
      </v-avatar>
      <v-card class="py-2 px-4 elevation-0 chat-row-card grey lighten-2">
        <div class="lds-ellipsis">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </v-card>
    </div>
    <div v-else class="chat-row">
      <v-avatar class="mr-2 avatar-outlined" size="20" v-if="!current">
        <img :src="user.profile_photo_path" />
      </v-avatar>
      <v-card
        class="py-2 px-4 elevation-0 chat-row-card"
        :class="{
          'secondary white--text': current,
          'grey lighten-2': !current
        }"
      >
        {{ content.file ? content.file : content.text }}
      </v-card>
      <v-avatar class="ml-2" size="20" v-if="current">
        <img :src="currentUser.profile_photo_path" />
      </v-avatar>
    </div>
  </v-fade-transition>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      toast: true
    }
  },
  props: {
    user: {
      type: Object,
      default: () => ({
        profile_photo_path:
          'https://icon-library.com/images/default-user-icon/default-user-icon-4.jpg',
        name: 'Stranger',
        id: null
      })
    },
    message: {
      type: Object,
      default: () => ({
        content: 'test',
        file: null
      })
    },
    current: {
      type: Boolean,
      default: false
    },
    typing: {
      type: Boolean,
      default: true
    }
  },
  methods: {},
  created() {},
  mounted() {
    // setTimeout(() => {
    //   this.toast = false
    // }, this.delay)
  },
  computed: {
    ...mapGetters('user', ['currentUser'])
  }
}
</script>
<style lang="scss" scoped>
.toast-notification {
  position: fixed;
  top: 15px;
  right: 15px;
  z-index: 9999;

  .toast-notification-button {
    position: absolute;
    top: 10px;
    right: 10px;
  }
}

.chat-row {
  position: relative;
  display: flex;
  .chat-row-card {
    position: relative;
    border-radius: 1rem;
  }
}

@keyframes lds-ellipsis1 {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
}
@keyframes lds-ellipsis3 {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(0);
  }
}
@keyframes lds-ellipsis2 {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(16px, 0);
  }
}
.lds-ellipsis {
  display: inline-block;
  position: relative;
  width: 2.5rem;
  height: 1rem;
  div {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: rotate(-50%, -50%);
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 50%;
    background: #1f91eb;
    animation-timing-function: cubic-bezier(0, 1, 1, 0);
    &:nth-child(1) {
      left: 0px;
      animation: lds-ellipsis1 0.6s infinite;
    }
    &:nth-child(2) {
      left: 0px;
      animation: lds-ellipsis2 0.6s infinite;
    }
    &:nth-child(3) {
      left: 16px;
      animation: lds-ellipsis2 0.6s infinite;
    }
    &:nth-child(4) {
      left: 32px;
      animation: lds-ellipsis3 0.6s infinite;
    }
  }
}
</style>
