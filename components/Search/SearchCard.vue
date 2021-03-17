<template>
  <v-card
    v-if="currentUser"
    id="search-card-app-bar"
    v-click-outside="{
      handler: onClickOutsideWithConditional,
      closeConditional
    }"
    width="400"
    :class="`elevation-${searchSelected ? 5 : 0}`"
  >
    <div class="primary search-card-header">
      <v-text-field
        style="border-radius: 15px;"
        background-color="white"
        autocomplete="off"
        v-model="searchKey"
        flat
        dense
        solo
        color="#000"
        hide-details="auto"
        :label="$t('Search')"
        @focus="onFocusSearch"
      >
        <template v-slot:prepend-inner>
          <v-btn x-small icon text class="success ml-n1 mt-n1">
            <v-icon color="white">mdi-magnify</v-icon>
          </v-btn>
        </template>
      </v-text-field>
    </div>
    <v-container v-if="searchSelected">
      <!-- Error temblade -->
      <div v-if="error">
        {{ error }}
      </div>
      <!-- Loading temblade -->
      <div v-else-if="loading" class="text-center">
        <v-progress-circular
          :width="1"
          size="50"
          color="purple"
          indeterminate
        ></v-progress-circular>
      </div>

      <!-- Search result temblade -->
      <div v-else-if="searchResult.length">
        <v-btn
          v-for="search in searchResult"
          :key="`search-result-${search.searchable.id}`"
          block
          text
          exact
          x-large
          replace
          class="text-none font-weight-bold"
          :to="
            localePath({
              name: 'index-user-url',
              params: { url: search.searchable.url }
            })
          "
          @click="onClickSearchResult"
        >
          <v-avatar size="40" class="ml-n4 mr-3">
            <img :src="search.searchable.profile_photo_path" />
          </v-avatar>
          {{ search.searchable.name }}
          <v-spacer />
        </v-btn>
      </div>

      <!-- Search history -->
      <div v-else-if="!searchKey">
        <div class="font-weight-bold text-subtitle-1">
          {{ $t('RecentSearches') }}
        </div>
        <div
          v-for="(search, index) in searchHistory"
          :key="`search-history-${search}`"
          class="search-button"
        >
          <v-btn
            block
            text
            exact
            large
            replace
            class="text-none"
            active-class="primary--text"
            :to="
              localePath({
                name: 'index-search-top',
                query: { search_key: search }
              })
            "
            @click="searchKey = search"
          >
            <v-avatar class="ml-n4">
              <v-icon>mdi-magnify</v-icon>
            </v-avatar>
            {{ search }}
            <v-spacer />
          </v-btn>
          <v-btn
            icon
            small
            text
            class="button-in-search-button"
            @click="onDeleteSearchHistory({ index, value: search })"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </div>
      </div>

      <!-- Search result -->
      <div v-else>
        <v-btn
          large
          block
          text
          replace
          exact
          :to="
            localePath({
              name: 'index-search-top',
              query: { search_key: searchKey }
            })
          "
          class="rounded-lg text-none primary--text"
        >
          <v-btn width="35" height="35" icon class="primary mr-3 ml-n1">
            <v-icon color="white">mdi-magnify</v-icon>
          </v-btn>
          {{ $t('SearchFor') }} {{ searchKey | shorterValue }}
          <v-spacer />
        </v-btn>
      </div>
    </v-container>
  </v-card>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import axios from 'axios'

export default {
  data() {
    return {
      searchKey: '',
      searchSelected: false,
      searchResult: [],
      loading: false,
      error: null
    }
  },
  methods: {
    ...mapActions('app', ['getSearchHistory', 'deleteSearchHistory']),
    onClickOutsideWithConditional() {
      this.searchSelected = false
    },
    closeConditional(e) {
      return this.searchSelected
    },
    async onFocusSearch() {
      this.searchSelected = this.loading = true
      this.error = null
      try {
        await this.getSearchHistory()
      } catch (err) {
        this.error = err.response ? err.response.data.message : err.toString()
      }
      this.loading = false
    },
    async onDeleteSearchHistory({ index, value }) {
      this.error = null
      try {
        await this.deleteSearchHistory({ index, value })
      } catch (err) {
        this.err = err.response ? err.response.data.message : err.toString()
      }
    },
    onClickSearchResult() {
      this.searchSelected = false
      this.searchKey = ''
      this.searchResult = []
    }
  },
  computed: {
    ...mapGetters('user', ['currentUser']),
    ...mapGetters('app', ['searchHistory'])
  },
  watch: {
    async searchKey(value) {
      if (!value) return
      this.loading = true
      this.error = null
      try {
        const response = await axios.post('v1/user/search/get', {
          search_key: value,
          history: false
        })
        this.searchResult = response.data.data
      } catch (err) {
        this.error = err.response.data.message
      }
      this.loading = false
    }
  }
}
</script>
<style lang="scss" scoped>
#search-card-app-bar {
  position: fixed;
  top: 0px;
  left: 50%;
  z-index: 9999;
  transform: translateX(-50%);
}

.search-button {
  position: relative;
  .button-in-search-button {
    position: absolute;
    top: 50%;
    right: 10px;
    transform: translateY(-50%);
  }
}

.search-card-header {
  display: flex;
  height: 56px;
  padding: 5px 15px 5px;
  justify-content: center;
  align-items: center;
}
</style>
