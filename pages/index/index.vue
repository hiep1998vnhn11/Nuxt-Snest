<template>
  <div>
    <!-- sidebar left -->
    <v-navigation-drawer
      v-model="drawer"
      v-if="currentUser"
      clipped
      bottom
      width="22rem"
      fixed
      app
    >
      <template v-slot:prepend>
        <v-sheet class="text-center mt-3">
          <v-avatar :size="64">
            <v-img :src="currentUser.profile_photo_path" />
          </v-avatar>
          <div class="font-weight-bold text-capitalize">
            {{ currentUser.name }}
          </div>
          <v-row class="mx-auto my-4" justify="center">
            <v-btn
              class="mx-1"
              width="40"
              height="40"
              text
              to="/"
              icon
              outlined
              active-class="primary--text"
            >
              <v-icon>mdi-home</v-icon>
            </v-btn>
          </v-row>
          <v-divider class="mx-4" />
        </v-sheet>
      </template>
      <v-skeleton-loader
        v-if="loadingFriend"
        type="list-item-avatar, list-item@5, divider, list-item-avatar@3"
      />
      <div v-else class="sidebar-container-scroll">
        <v-toolbar flat dense>
          {{ $t('Contacts') }}
          <v-spacer />
          <v-btn icon text small>
            <v-icon>mdi-magnify</v-icon>
          </v-btn>
          <v-btn icon text small class="ml-3">
            <v-icon>mdi-dots-horizontal</v-icon>
          </v-btn>
        </v-toolbar>
        <v-container>
          <user-button
            v-for="friend in friends"
            :key="friend.id"
            @click="onClickFriend(friend.user_friend)"
            :user="friend.user_friend"
            x_large
            size="45"
            class="mt-1"
          />
        </v-container>
      </div>
      <template v-slot:append>
        <v-divider class="mx-4" />
        <v-toolbar flat dense class="">
          Privacy
        </v-toolbar>
      </template>
    </v-navigation-drawer>

    <v-container>
      <post-create :loading="loading_user"></post-create>
      <div class="mt-3" v-if="posts.length">
        <post-component
          class="mt-3"
          v-for="(post, index) in posts"
          :key="post.creadted"
          :post="post"
          @onLike="onLike(index, post)"
        ></post-component>
      </div>
      <div v-else>Not have</div>
      <observer @intersect="intersected"></observer>
      <v-skeleton-loader
        v-if="loading"
        class="mx-auto mt-3"
        type="card"
      ></v-skeleton-loader>
    </v-container>

    <!-- sidebar right -->
    <v-navigation-drawer
      v-model="drawer"
      v-if="currentUser"
      clipped
      width="22rem"
      mini-variant-width="5rem"
      fixed
      flat
      right
      app
      style="z-index: 3;"
    >
      <!-- Default temblade -->
      <div>
        <div class="trending-card">
          <div class="box">
            <div class="content">
              <h2>{{ $t('Trending') }}</h2>
              <transition name="slide-fade">
                <div>
                  <p
                    v-for="value in Object.entries(trending)
                      .slice()
                      .reverse()"
                    :key="value[0]"
                  >
                    {{ value[0] }}: {{ value[1] }}
                  </p>
                </div>
              </transition>
            </div>
          </div>
        </div>
      </div>

      <div class="suggestion-card">
        <div class="box">
          <div class="content">
            <h2>{{ $t('Suggestions') }}</h2>
            <transition name="slide-fade">
              <div>
                <p
                  v-for="value in Object.entries(trending)
                    .slice()
                    .reverse()"
                  :key="value[0]"
                >
                  {{ value[0] }}: {{ value[1] }}
                </p>
              </div>
            </transition>
          </div>
        </div>
      </div>
    </v-navigation-drawer>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import axios from 'axios'
export default {
  props: ['loading_user'],
  middleware: 'auth',
  head() {
    return {
      title: 'Home'
    }
  },
  computed: {
    ...mapGetters('post', ['posts']),
    ...mapGetters('user', ['currentUser', 'friends']),
    ...mapGetters('app', ['trending'])
  },
  data() {
    return {
      loading: false,
      loadingFriend: false,
      loadingTrending: false,
      error: null,
      drawer: null
    }
  },
  mounted() {
    if (!this.friends.length) this.fetchFriend()
    this.fetchTrending()
  },
  methods: {
    ...mapActions('post', ['getPost', 'setFeedPage']),
    ...mapActions('user', ['getUser', 'getFriend']),
    ...mapActions('app', ['setMini', 'setDrawer']),
    ...mapActions('socket', ['connectSocket']),
    ...mapActions('message', ['getThreshByUser']),
    ...mapActions('app', ['getTrending']),
    async fetchTrending() {
      this.loadingTrending = true
      try {
        await this.getTrending()
      } catch (err) {
        this.error = err.response ? err.response.data.message : err.toString()
      }
      this.loadingTrending = false
    },
    async fetchFriend() {
      this.loadingFriend = true
      this.error = null
      try {
        await this.getFriend()
      } catch (err) {
        this.error = err.response.data.message
      }
      this.loadingFriend = false
    },
    async onClickFriend(user) {
      try {
        await this.getThreshByUser(user)
      } catch (err) {
        console.log(err.response.data.message)
      }
    },
    async fetchData() {
      this.error = null
      this.loading = true
      try {
        await this.getPost()
      } catch (err) {
        this.error = err.toString()
      }
      this.loading = false
    },
    intersected() {
      this.fetchData()
    },
    async onLike(index, post) {
      if (!post.isLiked) {
        this.$store.commit('post/LIKE_POST', index)
      } else {
        this.$store.commit('post/UNLIKE_POST', index)
      }
      let url = `/v1/user/post/${this.posts[index].id}/handle_like`
      await axios.post(url)
    }
  }
}
</script>

<style lang="scss">
.sidebar-container-scroll {
  overflow-y: hidden;
  height: 100%;
  &:hover {
    overflow-y: auto;
  }
  &::-webkit-scrollbar {
    width: 0.35rem;
  }
  &::-webkit-scrollbar-track {
    background: white;
    -webkit-border-radius: 10px;
    border-radius: 25px;
    padding: 10px;
  }
  &::-webkit-scrollbar-thumb {
    background: #9c27b0;
    -webkit-border-radius: 10px;
    border-radius: 10px;
  }
}
/* .slide-fade-leave-active below version 2.1.8 */
.trending-card {
  position: relative;
  height: 400px;
  .box {
    position: absolute;
    top: 1rem;
    left: 1rem;
    right: 1rem;
    bottom: 1rem;
    background: #fff;
    border-radius: 15px;
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
    transition: 0.5%;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: 0.5s ease-in-out;
    &:hover {
      transition: 0.5s ease-in-out;
      transform: translateY(-10px);
      box-shadow: 0 40px 70px rgba(0, 0, 0, 0.5);
      .content {
        h2 {
          opacity: 0.8;
          transform: translateY(calc(-155px + 50%));
          font-size: 1.8rem;
          transition: 0.5s ease-in-out;
        }
      }
    }
    .content {
      padding: 20px;
      text-align: center;
      h2 {
        position: absolute;
        left: 20px;
        opacity: 0.2;
        font-size: 3rem;
        font-weight: 900;
        transition: 0.5s ease-in-out;
      }
      h3 {
        font-size: 1.8rem;
        z-index: 1000;
        color: rgba(255, 255, 255, 0.5);
        transition: 0.5%;
      }
      p {
        font-size: 1rem;
        z-index: 1000;
        transition: 0.5%;
      }
    }
  }
}
.suggestion-card {
  position: relative;
  height: 300px;
  bottom: 0px;
  .box {
    position: absolute;
    top: 1rem;
    left: 1rem;
    right: 1rem;
    bottom: 1rem;
    background: #fff;
    border-radius: 15px;
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
    transition: 0.5%;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: 0.5s ease-in-out;
    &:hover {
      transition: 0.5s ease-in-out;
      transform: translateY(-10px);
      box-shadow: 0 40px 70px rgba(0, 0, 0, 0.5);
      .content {
        h2 {
          opacity: 0.8;
          transform: translateY(calc(-105px + 50%));
          font-size: 1.8rem;
          transition: 0.5s ease-in-out;
        }
      }
    }
    .content {
      padding: 20px;
      text-align: center;
      h2 {
        position: absolute;
        left: 20px;
        opacity: 0.2;
        font-size: 3rem;
        font-weight: 900;
        transition: 0.5s ease-in-out;
      }
      h3 {
        font-size: 1.225rem;
        z-index: 1000;
        color: rgba(255, 255, 255, 0.5);
        transition: 0.5%;
      }
      p {
        font-size: 1rem;
        z-index: 1000;
        transition: 0.5%;
      }
    }
  }
}
.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter {
  transform: translateX(10px);
  opacity: 0;
}
.slide-fade-leave-to {
  transform: translateX(10px);
  opacity: 0;
}
</style>
