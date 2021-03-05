<template>
  <div>
    <!-- sidebar left -->
    <v-navigation-drawer
      v-model="drawer"
      v-if="currentUser"
      clipped
      width="22rem"
      fixed
      app
    >
      <template v-slot:prepend>
        <v-sheet class="text-center">
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
        v-if="loading"
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
          v-for="post in posts"
          :key="post.creadted"
          :post="post"
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
    >
      <!-- Default temblade -->
      <div class="sidebar-container-scroll">
        <div v-if="loadingTrending" class="text-center my-10">
          <v-progress-circular
            :size="50"
            :width="2"
            color="purple"
            indeterminate
          ></v-progress-circular>
        </div>
        <div v-else class="trending-card">
          <div class="box">
            <div class="content">
              <h2>{{ $t('Trending') }}</h2>
              <p
                v-for="value in Object.entries(trending)
                  .slice()
                  .reverse()"
                :key="value[0]"
              >
                {{ value[0] }}: {{ value[1] }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </v-navigation-drawer>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  props: ['loading_user'],
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
    ...mapActions('message', ['setThreshCard']),
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
        await this.setThreshCard(user)
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
    }
  }
}
</script>

<style scoped>
.sidebar-container-scroll {
  overflow-y: hidden;
  height: 100%;
}

.sidebar-container-scroll:hover {
  overflow-y: auto;
}

.sidebar-container-scroll::-webkit-scrollbar {
  width: 0.35rem;
}

.sidebar-container-scroll::-webkit-scrollbar-track {
  background: white;
  -webkit-border-radius: 10px;
  border-radius: 25px;
  padding: 10px;
}

.sidebar-container-scroll::-webkit-scrollbar-thumb {
  background: #9c27b0;
  -webkit-border-radius: 10px;
  border-radius: 10px;
}

.trending-card {
  position: relative;
  min-height: 300px;
}

.trending-card .box {
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
  -webkit-transition: transform 0.3s ease-in-out;
}

.trending-card .box::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 50%;
  height: 100%;
  background: rgba(1, 255, 255, 0.6);
  border-top-left-radius: 15px;
  border-bottom-left-radius: 15px;
  pointer-events: none;
}
.trending-card .box:hover {
  -webkit-transition: transform 0.3s ease-in-out;
  transform: translateY(-10px);
  box-shadow: 0 40px 70px rgba(0, 0, 0, 0.5);
}

.trending-card .box .content {
  padding: 20px;
  text-align: center;
}

.trending-card .box .content h2 {
  position: absolute;
  right: 20px;
  width: 7rem;
  background: red;
  opacity: 0.5;
  font-weight: 900;
  -webkit-transition: transform 0.6s ease-in-out;
}

.trending-card .box:hover .content h2 {
  opacity: 1;
  transform: translateX(-2rem);
  -webkit-transition: transform 0.6s ease-in-out;
}

.trending-card .box .content h3 {
  font-size: 1.8rem;
  z-index: 1000;
  color: rgba(255, 255, 255, 0.5);
  transition: 0.5%;
}

.trending-card .box .content p {
  font-size: 1rem;
  font-weight: 300;
  z-index: 1000;
  transition: 0.5%;
}
</style>
