<template>
  <v-container>
    <v-row justify="center" class="pa-16">
      <v-col cols="12" md="7" lg="7" sm="12" class="text-center">
        <v-card class="rounded-lg">
          <v-card-title>
            {{ title }}
          </v-card-title>
          <v-divider />
          <v-container>
            <v-alert v-if="error" dense outlined type="error">
              <strong>{{ error }}</strong>
            </v-alert>
            <div v-if="!user" class="px-5">
              <v-text-field
                :label="$t('PleaseEnterYourEmailToSearchAccount')"
                :placeholder="$t('Email')"
                outlined
                dense
                class="mt-5"
                :rules="emailRules"
                v-model="searchKey"
                @keyup.enter="fetchData"
              ></v-text-field>
            </div>
            <div v-else class="text-left">
              {{ $t('AccountMatchYourSearch') }}
              <v-list two-line>
                <v-list-item>
                  <v-list-item-avatar>
                    <img :src="user.profile_photo_path" />
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title class="font-weight-bold">
                      {{ user.name }}
                    </v-list-item-title>
                  </v-list-item-content>

                  <v-list-item-action>
                    <v-btn
                      text
                      outlined
                      class="text-none"
                      @click.stop="onSelectAccount"
                    >
                      {{ $t('ThisIsMyAccount') }}
                    </v-btn>
                  </v-list-item-action>
                </v-list-item>
              </v-list>
            </div>
          </v-container>
          <v-divider />
          <v-card-actions>
            <v-spacer />
            <div v-if="!user">
              <v-btn
                text
                class="text-none primary--text"
                outlined
                :loading="loading"
                :disabled="loading"
                @click.stop="fetchData"
              >
                {{ $t('Search') }}
              </v-btn>
              <v-btn text class="text-none" outlined>
                {{ $t('Cancel') }}
              </v-btn>
            </div>
            <v-btn
              v-else
              outlined
              text
              class="text-none primary--text"
              @click="onBackAccount"
            >
              {{ $t('Back') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import Cookie from 'js-cookie'
import axios from 'axios'

export default {
  data() {
    const _this = this
    return {
      user: null,
      searchKey: '',
      loading: false,
      error: null,
      emailRules: [
        v => !!v || _this.$t('Rule.EmailRequired'),
        v => /.+@.+/.test(v) || _this.$t('Rule.EmailNotValid')
      ]
    }
  },
  middleware: 'guest',

  methods: {
    async fetchData() {
      if (!this.searchKey) return
      this.loading = true
      this.error = null
      try {
        const response = await axios.get(
          `v1/guest/search/identify?search_key=${this.searchKey}`
        )
        if (response.data.data) {
          this.user = response.data.data
        } else {
          this.error = this.$t('PleaseEnterYourCorrectEmail')
        }
      } catch (err) {
        this.error = err.response.data.message
      }
      this.loading = false
      this.searchKey = ''
    },
    onSelectAccount() {
      Cookie.set('recover_user', this.user)
      this.$router.push({ name: 'recover-initiate' })
    },
    onBackAccount() {
      this.user = null
    }
  },
  created() {
    if (Cookie.get('recover_user')) {
      this.$router.push({ name: 'recover-initiate' })
    }
  },
  mounted() {},
  computed: {
    title() {
      return this.user
        ? this.$t('IdentifyYourAccount')
        : this.$t('SearchYourAccount')
    }
  }
}
</script>
<style scoped></style>
