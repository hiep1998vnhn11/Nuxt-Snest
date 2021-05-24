<template>
  <v-btn @click="expand = true" outlined icon text class="ml-2 mt-3">
    <v-icon>mdi-dots-horizontal</v-icon>
    <div class="show-more-2">
      <v-expand-transition right>
        <v-card
          v-click-outside="{
            handler: onClickOutsideWithConditional,
            closeConditional
          }"
          v-show="expand"
          width="220"
          class="mx-auto"
        >
          <v-btn v-if="current" block text class="text-capitalize" small>
            <v-icon class="mr-2">mdi-format-list-checkbox</v-icon>
            activity diary
            <v-spacer></v-spacer>
          </v-btn>
          <v-btn
            @click="dialog = true"
            v-else
            block
            text
            class="text-capitalize"
            small
          >
            <v-icon class="mr-2">mdi-alert-box-outline</v-icon>
            {{ $t('Report this personal page') }}
            <v-spacer></v-spacer>
          </v-btn>
          <v-btn v-if="current" block text class="text-capitalize" small>
            <v-icon class="mr-2">mdi-account-cog-outline</v-icon>
            {{ $t('Setting your time line') }}
            <v-spacer></v-spacer>
          </v-btn>
          <v-btn v-else block text class="text-capitalize" small>
            <v-icon class="mr-2">mdi-account-cancel-outline</v-icon>
            {{ $t('Block this user') }}
            <v-spacer></v-spacer>
          </v-btn>
        </v-card>
      </v-expand-transition>
    </div>
    <v-dialog v-model="dialog" max-width="600" persistent>
      <v-card>
        <v-card-title class="font-weight-bold">
          <v-spacer></v-spacer>
          {{ $t('Report this user') }}
          <v-spacer></v-spacer>
          <v-btn icon class="grey lighten-2">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider />
        <v-container>
          {{ $t('Please choose the problem you had seen') }}
          <div class="text-body-2">
            '
            {{
              $t(
                'You only can report this personal page after choose one problem'
              )
            }}
          </div>
          <v-list-item-group v-model="problem">
            <v-btn
              v-for="n in 10"
              :key="n"
              text
              outlined
              rounded
              class="text-capitalize"
            >
              problem {{ n }}
            </v-btn>
          </v-list-item-group>
        </v-container>
      </v-card>
    </v-dialog>
  </v-btn>
</template>

<script>
export default {
  props: ['current'],
  methods: {
    onClickOutsideWithConditional() {
      this.expand = false
    },
    closeConditional(e) {
      return this.expand
    }
  },
  computed: {
    classes() {
      return this.expand ? 'primary--text blue lighten-4' : null
    }
  },
  data() {
    return {
      expand: false,
      dialog: false,
      problem: null
    }
  }
}
</script>

<style>
.show-more-2 {
  position: absolute;
  z-index: 100;
  top: 40px;
}
</style>
