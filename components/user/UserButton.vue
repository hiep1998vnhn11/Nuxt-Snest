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
      :color="color"
      dot
      offset-x="22"
      offset-y="37"
    >
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
    },
    color() {
      return this.user.online_status.status ? 'success' : 'grey'
    }
  }
}
</script>
