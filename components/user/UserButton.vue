.<template>
  <v-btn
    x-large
    block
    text
    :class="`rounded-md text-capitalize`"
    @click="$emit('click')"
  >
    <v-badge
      bordered
      avatar
      overlap
      color="success"
      dot
      offset-x="22"
      offset-y="37"
      v-if="user.online_status.status"
    >
      <v-avatar size="40" class="avatar-outlined mr-3 ml-n3">
        <img :alt="user.name" :src="user.profile_photo_path" />
      </v-avatar>
    </v-badge>
    <v-badge
      color="green lighten-4"
      bordered
      offset-x="32"
      offset-y="37"
      small
      v-else
    >
      <template v-slot:badge>
        <div class="black--text">
          {{ user.online_status.time | offlineTime }}
        </div>
      </template>
      <v-avatar size="40" class="avatar-outlined mr-3 ml-n3">
        <img :alt="user.name" :src="user.profile_photo_path" />
      </v-avatar>
    </v-badge>
    {{ user.name }}
    <v-spacer></v-spacer>
  </v-btn>
</template>

<script>
export default {
  props: {
    user: {
      type: Object,
      default: () => ({
        online_status: {
          status: false
        }
      })
    }
  },
  computed: {
    avatarOutlined() {
      return this.avatar_outlined ? 'avatar-outlined' : ''
    }
  }
}
</script>

<style>
.avatar-outlined {
  border: thin solid rgba(0, 0, 0, 0.12) !important;
}
</style>
