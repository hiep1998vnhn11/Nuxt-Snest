<template>
  <v-fade-transition>
    <div class="chat-row" v-if="typing">
      <v-avatar class="mr-1 mt-1 avatar-outlined" size="15" v-if="!current">
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
      <v-slide-x-transition>
        <div v-if="select" flat class="chat-row-actions-menu">
          <v-card class="elevation-20 py-1 px-3" rounded="lg">
            <v-btn text @click="onDeleteMessage" class="text-capitalize" small>
              {{ $t('Remove') }}
            </v-btn>
          </v-card>
        </div>
      </v-slide-x-transition>
      <v-spacer v-if="current" />
      <div>
        <v-avatar class="mr-1 avatar-outlined mt-1" size="15" v-if="!current">
          <img :src="user.profile_photo_path" />
        </v-avatar>
        <div v-else class="chat-row-actions">
          <div class="chat-row-actions-tooltip">
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  class="chat-row-actions-button"
                  icon
                  small
                  v-bind="attrs"
                  v-on="on"
                  @click="select = !select"
                >
                  <v-icon>
                    mdi-dots-vertical
                  </v-icon>
                </v-btn>
              </template>
              <span>{{ $t('Actions') }}</span>
            </v-tooltip>
          </div>
        </div>
      </div>
      <v-tooltip top>
        <template v-slot:activator="{ on, attrs }">
          <v-card
            class="py-2 px-4 elevation-0 chat-row-card"
            :class="{
              'secondary white--text': current,
              'grey lighten-2': !current
            }"
            v-bind="attrs"
            v-on="on"
          >
            <div v-if="idDeleted" class="text-caption font-italic">
              {{
                current ? $t('YouUnsentAMessage') : $t('ThisMessageIsUnsent')
              }}
            </div>
            <div v-else>
              {{ message.file ? message.file : message.content }}
            </div>
          </v-card>
        </template>
        <span> {{ message.created_at | messageTime }} </span>
      </v-tooltip>

      <div v-if="current">
        <v-avatar class="ml-1 mt-1 avatar-outlined" size="15" v-if="current">
          <img :src="currentUser.profile_photo_path" />
        </v-avatar>
      </div>
    </div>
  </v-fade-transition>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      select: false
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
      default: false
    }
  },
  methods: {
    onDeleteMessage() {
      this.$emit('deleteMessasge', this.message.id)
    }
  },
  created() {},
  mounted() {
    // setTimeout(() => {
    //   this.toast = false
    // }, this.delay)
  },
  computed: {
    ...mapGetters('user', ['currentUser']),
    idDeleted() {
      return this.message.deleted_at !== null
    }
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
  justify-content: right;
  margin-top: 5px;
  .chat-row-actions-menu {
    position: absolute;
    z-index: 100;
    top: 0px;
    left: 50%;
    transform: translateY(-100%) translateX(-50%);
  }
  .chat-row-actions {
    position: relative;
    display: flex;
    justify-content: center;
    height: 100%;
    margin-left: 5px;
    margin-right: 5px;
    text-align: center;
    align-items: center;
    .chat-row-actions-tooltip {
      position: relative;
      .chat-row-actions-button {
        opacity: 0;
      }
    }
  }
  .chat-row-card {
    position: relative;
    border-radius: 1rem;
    max-width: 80%;
  }

  &:hover {
    .chat-row-actions {
      .chat-row-actions-button {
        opacity: 1;
      }
    }
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
