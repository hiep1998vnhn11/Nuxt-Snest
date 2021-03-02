.<template>
  <div>
    <base-not-display v-if="!loading && !paramUser" />
    <profile-header
      :user="paramUser"
      :loading="loading"
      class="index-3"
      @changed-avatar="fetchData(true)"
      @changed-background="fetchData(true)"
      @changed-status-friend-accepted="changeStatusFriendAccept"
      @changed-status-friend-denied="changeStatusFriendDenied"
      @changed-status-friend-added="changeStatusFriendAdded"
    ></profile-header>
    <router-view :user="paramUser"></router-view>
  </div>
</template>

<script>
import axios from 'axios'
import ProfileHeader from '@/components/Profile/Header'
import { mapGetters } from 'vuex'

export default {
  components: {
    'profile-header': ProfileHeader
  },
  data() {
    return {
      paramUser: null,
      loading: false,
      error: null
    }
  },
  async created() {
    if (!this.paramUser) this.fetchData()
  },
  watch: {
    '$route.params': 'fetchData'
  },
  computed: mapGetters('user', ['isLoggedIn']),
  methods: {
    async fetchData(reload) {
      const userUrl = this.$route.params.url
      if (this.paramUser && userUrl === this.paramUser.url && reload !== true) {
        return
      }
      this.error = null
      this.loading = true
      try {
        const url = this.isLoggedIn ? '/v1/user/get_user' : '/v1/guest/user/get'
        const response = await axios.get(url, {
          params: {
            user_url: userUrl
          }
        })
        this.paramUser = response.data.data
      } catch (err) {
        this.paramUser = null
        this.error = err.toString()
      }
      this.loading = false
    },
    changeStatusFriendAccept() {
      this.paramUser.friend_status = 1
    },
    changeStatusFriendDenied() {
      this.paramUser.friend_status = 0
    },
    changeStatusFriendAdded() {
      this.paramUser.friend_status = 4
    }
  }
}
</script>

<style>
.index-3 {
  z-index: 3;
}
</style>
