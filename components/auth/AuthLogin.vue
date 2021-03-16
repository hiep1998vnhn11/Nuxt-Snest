<template>
  <div class="login-body">
    <loading-component v-if="loading" />

    <div class="login-card">
      <loading-component
        v-if="facebook.loading && facebook.user"
        :text="`${$t('Welcome')} ${facebook.user}`"
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
        <v-btn icon x-large class="mr-1">
          <v-avatar size="50">
            <img src="~/assets/icons/google-icon.webp" />
          </v-avatar>
        </v-btn>

        <div class="g-signin2" @data-onsuccess="onSignIn"></div>
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
      }
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
    testAPI() {
      // Testing Graph API after login.  See statusChangeCallback() for when this call is made.
      console.log('Welcome!  Fetching your information.... ')
      FB.api('me?fields=id,name,email,link,birthday', function(response) {
        console.log('Successful login for: ' + response.name)
        document.getElementById('status').innerHTML =
          'Thanks for logging in, ' + response.name + '!'
      })
    },
    onSignIn(googleUser) {
      var profile = googleUser.getBasicProfile()
      console.log('ID: ' + profile.getId()) // Do not send to your backend! Use an ID token instead.
      console.log('Name: ' + profile.getName())
      console.log('Image URL: ' + profile.getImageUrl())
      console.log('Email: ' + profile.getEmail()) // This is null if the 'email' scope is not present.
    }
  },
  mounted() {
    FB.init({
      appId: process.env.NUXT_ENV_FACEBOOK_APP_ID,
      autoLogAppEvents: true,
      xfbml: true,
      version: process.env.NUXT_ENV_FACEBOOK_APP_VERSION
    })
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
