<template>
  <div class="login-body">
    <loading-component v-if="loading" />

    <div class="login-card">
      <loading-component
        v-if="facebook.loading && facebook.user"
        :text="`${$t('Welcome')} ${facebook.user}`"
      />
      <loading-component
        v-if="google.loading && google.user"
        :text="`${$t('Welcome')} ${google.user.name}`"
      />
      <h1>
        {{ $t('Login') }}
      </h1>
      <v-container>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-text-field
            class="login-input"
            v-model="email"
            :rules="emailRules"
            autocomplete="off"
            :label="$t('Email')"
            required
            color="rgba(255,255,255,0.5)"
            @keyup.enter="onLogin"
          ></v-text-field>
          <v-text-field
            v-model="password"
            autocomplete="off"
            type="password"
            :rules="passwordRules"
            :label="$t('Password')"
            required
            @keyup.enter="onLogin"
          ></v-text-field>
        </v-form>
        {{ $t('common.forgotPassword') }}
      </v-container>
      <div>
        <v-btn
          color="primary"
          class="text-capitalize mb-3"
          block
          outlined
          rounded
          @click="onLogin"
        >
          {{ $t('common.login') }}
        </v-btn>
        <auth-register class="mx-auto" />
      </div>
      <div class="mt-3">
        <v-btn
          :loading="facebook.loggingIn"
          :disabled="facebook.loggingIn || !!facebook.user"
          icon
          text
          outlined
          x-large
          class="mr-1"
          @click="onLoginFacebook"
        >
          <v-avatar size="50">
            <img src="~/assets/icons/facebook.png" />
          </v-avatar>
        </v-btn>
        <v-btn
          :loading="google.loggingIn"
          icon
          x-large
          class="mr-1"
          @click="onSignInGoogle"
        >
          <v-avatar size="50">
            <img src="~/assets/icons/google-icon.webp" />
          </v-avatar>
        </v-btn>
      </div>
      <v-btn
        v-if="facebook.user && facebook.accessToken"
        color="primary"
        class="text-capitalize mt-3"
        block
        outlined
        rounded
        @click="onContinueFacebook"
      >
        <v-spacer />
        {{ $t('ContinueWith') }} {{ facebook.user }}
        <v-spacer />
        <v-avatar size="35" class="mr-n4">
          <img :src="facebook.picture" />
        </v-avatar>
      </v-btn>
      <v-btn
        v-if="google.user && google.id_token"
        color="primary"
        class="text-capitalize mt-3"
        block
        outlined
        rounded
        @click="onContinueGoogle"
      >
        <v-spacer />
        {{ $t('ContinueWith') }} {{ google.user.name }}
        <v-spacer />
        <v-avatar size="35" class="mr-n4">
          <img :src="google.user.profile_photo_path" />
        </v-avatar>
      </v-btn>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import socketService from '@/services/socket'

export default {
  data() {
    const _this = this
    return {
      valid: true,
      email: null,
      password: null,
      emailRules: [
        v => !!v || _this.$t('Rule.EmailRequired'),
        v => /.+@.+/.test(v) || _this.$t('Rule.EmailNotValid')
      ],
      passwordRules: [v => !!v || _this.$t('Rule.PasswordRequired')],
      registerSuccess: false,
      loading: false,
      error: null,
      loginError: false,
      facebook: {
        loggingIn: false,
        loading: false,
        user: false,
        accessToken: null,
        picture: null
      },
      google: {
        auth: null,
        user: null,
        loggingIn: false,
        id_token: null,
        loading: false
      },
      googleAuth: null
    }
  },
  computed: {
    ...mapGetters('user', ['isLoggedIn'])
  },
  methods: {
    async onLogin() {
      if (!this.password || !this.email) {
        this.$refs.form.validate()
        return
      }
      if (!this.valid) return
      this.loading = true
      this.error = null
      try {
        await this.$store.dispatch('user/login', {
          email: this.email,
          password: this.password
        })
        if (
          this.$store.getters['user/isLoggedIn'] &&
          !this.$store.getters['user/currentUser'] &&
          (!window.socket || window.socket.disconnected)
        ) {
          await this.$store.dispatch('user/getUser')
          socketService.connectSocket(this.$store)
        }
      } catch (err) {
        this.$nuxt.error(err)
      }
      this.loading = false
    },
    async onLoginFacebook() {
      this.facebook.loggingIn = true
      const _this = this
      FB.getLoginStatus(async function(response) {
        if (response.status === 'connected') {
          FB.api('/me', { fields: 'picture,name' }, function(response) {
            _this.facebook.user = response.name
            _this.facebook.picture = response.picture.data.url
          })
          _this.facebook.accessToken = response.authResponse.accessToken
          _this.facebook.loggingIn = false
        } else {
          FB.login(
            async function(response) {
              if (response.authResponse) {
                FB.api('/me', { fields: 'picture,name' }, function(response) {
                  console.log(response)
                  _this.facebook.user = response.name
                  _this.facebook.picture = response.picture.data.url
                })
                _this.facebook.accessToken = response.authResponse.accessToken
                _this.facebook.loggingIn = false
              }
            },
            {
              scope:
                'public_profile,email,user_gender,user_link,user_location,user_birthday',
              return_scopes: true
            }
          )
        }
      })
      this.facebook.loggingIn = false
    },
    async onContinueFacebook() {
      if (!this.facebook.accessToken) return
      this.facebook.loading = true
      try {
        await this.$store.dispatch(
          'user/loginFacebook',
          this.facebook.accessToken
        )
        if (!window.socket || window.socket.disconnected) {
          socketService.connectSocket(this.$store)
        }
      } catch (err) {
        this.$nuxt.error(err)
      }
      this.facebook.loading = false
    },
    async onLogoutFacebook() {},
    statusChangeCallback(response) {
      // Called with the results from FB.getLoginStatus().
      // The current login status of the person.
      if (response.status === 'connected') {
        // Logged into your webpage and Facebook.
        console.log(response)
      } else {
        // Not logged into your webpage or we are unable to tell.
        console.log(response)
        console.log('failed!')
      }
    },
    checkLoginState() {
      const store = this.$store
      // Called when a person is finished with the Login Button.
      try {
        FB.getLoginStatus(async function(response) {
          // See the onlogin handler
          if (response.status === 'connected') {
            await store.dispatch(
              'user/loginFacebook',
              response.authResponse.accessToken
            )
            socketService.connectSocket(this.$store)
          } else {
            console.log('please login')
          }
        })
      } catch (err) {
        this.$nuxt.error(err)
      }
    },
    async onSignInGoogle() {
      // signInCallback defined in step 6.
      if (this.google.user && this.google.id_token) {
        return this.onSignOutGoogle()
      }
      this.google.loggingIn = true
      try {
        const googleUser = await this.google.auth.signIn()
        const user = {
          name: googleUser.getBasicProfile().getName(),
          email: googleUser.getBasicProfile().getEmail(),
          profile_photo_path: googleUser.getBasicProfile().getImageUrl()
        }
        this.google.user = user
        this.google.id_token = googleUser.getAuthResponse().id_token
      } catch (err) {
        this.$nuxt.error(err)
      }
      this.google.loggingIn = false
    },
    async onSignOutGoogle() {
      try {
        await this.google.auth.disconnect()
        this.google.user = this.google.id_token = null
      } catch (err) {
        this.$nuxt.error(err)
      }
    },
    async onContinueGoogle() {
      if (!this.google.id_token || !this.google.user) return
      this.google.loading = true
      try {
        await this.$store.dispatch('user/loginGoogle', this.google.id_token)
        if (!window.socket || window.socket.disconnected) {
          socketService.connectSocket(this.$store)
        }
      } catch (err) {
        this.$nuxt.error(err)
      }
      this.google.loading = false
    },
    startGoogleObject() {
      if (typeof gapi != 'undefined' && gapi != null) {
        const vm = this
        gapi.load('auth2', function() {
          vm.google.auth = gapi.auth2.init({
            client_id: process.env.NUXT_ENV_GOOGLE_CLIENT_ID,
            // Scopes to request in addition to 'profile' and 'email'
            scope: 'profile email'
          })
        })
      } else {
        this.$notify({
          group: 'notification',
          title: 'Warning',
          type: 'warning',
          text: this.$t(
            'Your browser do not support Google, suggest Google Chrome'
          )
        })
      }
    },
    startFacebookInit() {
      if (typeof FB != 'undefined' && FB != null) {
        FB.init({
          appId: process.env.NUXT_ENV_FACEBOOK_APP_ID,
          autoLogAppEvents: true,
          xfbml: true,
          version: process.env.NUXT_ENV_FACEBOOK_APP_VERSION
        })
      } else {
        this.$notify({
          group: 'notification',
          title: 'Warning',
          type: 'warning',
          text: this.$t('Your browser do not support FB, suggest Google Chrome')
        })
      }
    }
  },
  mounted() {
    this.startFacebookInit()
    this.startGoogleObject()
  }
}
</script>

<style lang="scss" scoped>
.login-body {
  position: fixed;
  z-index: 9999;
  top: 0px;
  right: 0px;
  left: 0px;
  bottom: 0px;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(60deg, #1a5cff, #f904fe);
  .login-card {
    position: relative;
    padding: 20px;
    width: 400px;
    border-radius: 15px;
    box-shadow: 20px 20px 50px rgba(0, 0, 0, 0.5);
    background: rgba(255, 255, 255, 0.1);
    overflow: hidden;
    text-align: center;
    // display: flex;
    // justify-content: center;
    // align-items: center;
    border-top: 1px solid rgba(255, 255, 255, 0.5);
    border-left: 1px solid rgba(255, 255, 255, 0.5);
    // backdrop-filter: blur(5px);
    h1 {
      font-weight: 6rem;
    }
  }
}
</style>
