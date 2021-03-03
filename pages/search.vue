<template>
  <div>
    <v-navigation-drawer v-model="drawer" clipped fixed app>
      <!-- Search temblade -->
      <v-container>
        <v-btn
          v-for="item in searchLink"
          :key="`search-link-${item.text}`"
          class="text-capitalize mt-1"
          large
          block
          text
          active-class="primary--text"
          :to="localePath({ name: item.name, query: $route.query })"
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-title v-text="item.text"></v-list-item-title>
        </v-btn>
      </v-container>
    </v-navigation-drawer>
    <nuxt-child />
  </div>
</template>
<script>
export default {
  data() {
    const _this = this
    return {
      drawer: null,
      searchLink: [
        {
          icon: 'mdi-dock-top',
          text: _this.$t('All'),
          name: 'search-top'
        },
        {
          icon: 'mdi-dock-top',
          text: _this.$t('Posts'),
          name: 'search-posts'
        },
        {
          icon: 'mdi-dock-top',
          text: _this.$t('People'),
          name: 'search-people'
        }
      ]
    }
  },
  methods: {},
  created() {},
  mounted() {},
  computed: {}
}
</script>
<style scoped></style>
