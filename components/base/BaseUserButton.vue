.<template>
  <v-btn
    :outlined="outlined"
    :x-large="x_large"
    block
    text
    :class="`rounded-md text-capitalize text-body-2 ${classes} ${fontBold}`"
    @click="$emit('click')"
  >
    <v-avatar :size="size" :class="`${avatar_class} ${avatarOutlined} mr-3`">
      <img v-if="!icon" :src="src" />
      <v-icon v-else :color="icon_color">{{ icon_name }}</v-icon>
    </v-avatar>
    {{ name }}
    <v-spacer></v-spacer>
  </v-btn>
</template>

<script>
export default {
  name: 'BaseUserButton',
  props: {
    icon_name: String,
    icon_color: String,
    icon: Boolean,
    src: String,
    name: String,
    avatar_outlined: Boolean,
    size: {
      type: Number,
      default: 32
    },
    outlined: Boolean,
    x_large: Boolean,
    bold: Boolean,
    classes: String,
    avatar_class: String
  },
  computed: {
    avatarOutlined() {
      return this.avatar_outlined ? 'avatar-outlined' : ''
    },
    fontBold() {
      return this.bold ? 'font-weith-bold' : ''
    }
  }
}
</script>
