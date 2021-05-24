<template>
  <div>
    <v-tooltip bottom>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          @click="expand = true"
          text
          :class="`ml-2 grey lighten-3 ${classes}`"
          v-bind="attrs"
          v-on="on"
        >
          <v-icon class="ml-n4 mr-n4">mdi-view-headline</v-icon>
        </v-btn>
      </template>
      <span>{{ $t('common.more') }}</span>
    </v-tooltip>
    <div class="show-more-app-bar">
      <v-expand-transition right>
        <v-card
          v-click-outside="{
            handler: onClickOutsideWithConditional,
            closeConditional
          }"
          v-show="expand"
          width="115"
          class="mx-auto"
        >
          <v-container>
            <v-tooltip bottom v-for="tab in tabs" :key="`tab-${tab.name}`">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  text
                  x-large
                  :to="localePath({ name: tab.name })"
                  v-bind="attrs"
                  v-on="on"
                  active-class="primary--text"
                  class="mr-2"
                  exact
                >
                  <v-icon>{{ tab.icon }}</v-icon>
                </v-btn>
              </template>
              <span>{{ tab.text }}</span>
            </v-tooltip>
          </v-container>
        </v-card>
      </v-expand-transition>
    </div>
  </div>
</template>

<script>
export default {
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
      expand: false
    }
  },
  props: ['tabs']
}
</script>

<style scoped>
.show-more-app-bar {
  position: absolute;
  z-index: 100;
  top: 50px;
}
</style>
