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
          <v-divider />
        </v-sheet>
      </template>
      <v-skeleton-loader
        v-if="loading"
        type="list-item-avatar, list-item@5, divider, list-item-avatar@3"
      />
      <div v-else class="sidebar-container-scroll">
        container
      </div>
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
      <v-skeleton-loader
        v-if="loading"
        type="list-item-avatar, list-item@5, divider, list-item-avatar@3"
      />
      <!-- Default temblade -->
      <div class="sidebar-container-scroll" v-else>
        container
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
    ...mapGetters('user', ['currentUser'])
  },
  data() {
    return {
      loading: false,
      error: null,
      drawer: null
    }
  },
  methods: {
    ...mapActions('post', ['getPost', 'setFeedPage']),
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
</style>
