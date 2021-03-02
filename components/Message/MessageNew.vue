<template>
  <v-card
    :class="`new-message-card-component rounded-lg ${elevation} message-card_${location}`"
    v-click-outside="{
      handler: onClickOutsideWithConditional,
      closeConditional,
    }"
    :ripple="false"
    :loading="loading"
    @click="clickCard"
    height="450"
  >
    <v-toolbar dense color="elevation-0">
      <span class="font-weight-bold">
        {{ $t('NewMessage') }}
      </span>
      <v-spacer />
      <v-btn icon small @click="onCloseCard">
        <v-icon :color="selected ? 'primary' : ''">mdi-close</v-icon>
      </v-btn>
    </v-toolbar>
    <v-card-title class="my-n4">
      <v-text-field
        v-model="search"
        :label="$t('To:')"
        ref="search"
        dense
      ></v-text-field>
    </v-card-title>

    <v-divider />
    <v-card-text class="new-message-card-text-component" id="container">
      <v-tooltip
        left
        v-for="friend in filterFriend"
        :key="`friend-${friend.id}`"
        color="white"
        max-width="350"
        min-width="350"
        allow-overflow
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            block
            text
            x-large
            class="text-none"
            v-on="on"
            v-bind="attrs"
            @click="$emit('click-user', friend)"
          >
            <v-badge
              bordered
              bottom
              :color="
                friend.user_friend.online_status.status
                  ? 'deep-purple accent-4'
                  : 'grey'
              "
              dot
              offset-x="10"
              offset-y="10"
              class="ml-n4 mr-2"
            >
              <v-avatar size="40" class="avatar-outlined">
                <v-img :src="friend.user_friend.profile_photo_path"></v-img>
              </v-avatar>
            </v-badge>

            <span
              class="font-weight-bold text-body-2"
              v-text="friend.user_friend.name"
            />
            <v-spacer />
          </v-btn>
        </template>
        <v-row class="black--text">
          <v-col cols="4">
            <v-avatar size="100" class="avatar-outlined">
              <img :src="friend.user_friend.profile_photo_path" />
            </v-avatar>
          </v-col>
          <v-col cols="7" class="ml-3">
            <v-row class="font-weight-bold text-h6">
              {{ friend.user_friend.name }}
            </v-row>
            <v-row no-gutters>
              <v-col cols="2">
                <v-icon>mdi-account-group</v-icon>
              </v-col>
              <v-col cols="10">
                <span> ansd </span>
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col cols="2">
                <v-icon>mdi-home</v-icon>
              </v-col>
              <v-col cols="10">
                {{ friend.user_friend.name }}
              </v-col>
              {{ friend.user_friend.id }}
            </v-row>
          </v-col>
        </v-row>
      </v-tooltip>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import MessageRow from './MessageRow'

export default {
  computed: {
    ...mapGetters('user', ['currentUser', 'friends']),
    ...mapGetters('message', ['messages']),
    elevation() {
      return this.selected ? 'elevation-20' : ''
    },
    filterFriend() {
      const _this = this
      return this.friends.filter(function(friend) {
        return (
          friend.user_friend.name
            .toLowerCase()
            .search(_this.search.toLowerCase()) > -1
        )
      })
    }
  },
  components: {
    MessageRow
  },
  data() {
    return {
      text: '',
      selected: false,
      active: true,
      loading: false,
      error: null,
      search: '',
      show: true
    }
  },
  methods: {
    ...mapActions('message', ['getMessage', 'sendMessage', 'closeMessageCard']),
    onClickOutsideWithConditional() {
      this.selected = false
    },
    closeConditional(e) {
      return this.selected
    },
    scrollToBottom() {
      var container = this.$el.querySelector('#container')
      container.scrollTop = container.scrollHeight
    },
    newLine() {
      this.text = this.text
    },
    clickCard() {
      this.selected = true
    },
    onCloseCard() {
      this.closeMessageCard(this.location)
    }
  },
  props: ['location']
}
</script>

<style scoped>
.new-message-card-component {
  position: fixed;
  z-index: 3;
  bottom: 5px;
  width: 330px;
}

.new-message-card-text-component {
  overflow-y: scroll;
  height: 350px;
}

.new-active-now-icon {
  position: fixed;
  left: -13px;
  top: 10px;
}

.new-message-card-text-component::-webkit-scrollbar {
  width: 0.25rem;
}

.new-message-card-text-component::-webkit-scrollbar-track {
  background: white;
}

.new-message-card-text-component::-webkit-scrollbar-thumb {
  background: #0077ff;
}
</style>
