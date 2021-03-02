<template>
  <v-dialog v-model="dialog" max-width="500">
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        class="text-capitalize text-h6"
        block
        large
        color="success"
        dark
        v-bind="attrs"
        v-on="on"
      >
        {{ $t('common.register') }}
      </v-btn>
    </template>
    <v-card :loading="loading">
      <v-card-title>
        {{ $t('common.register') }}
        <v-spacer></v-spacer>
        <v-btn icon @click="dialog = false">
          <v-icon color="dark">mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-divider class="mx-4"></v-divider>
      <v-container>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-text-field
            v-model="email"
            :rules="emailRules"
            :label="$t('Email')"
            required
          ></v-text-field>
          <v-text-field
            v-model="name"
            :rules="nameRules"
            :label="$t('Name')"
            required
          ></v-text-field>
          <v-text-field
            v-model="password"
            type="password"
            :rules="passwordRules"
            :label="$t('Password')"
            required
          ></v-text-field>
          <div class="text-left">
            <v-dialog
              ref="dialog"
              v-model="birthDayDialog"
              :return-value.sync="birthDay"
              persistent
              width="290px"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="birthDay"
                  :label="$t('user.message.register.birthday')"
                  prepend-icon="mdi-calendar"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker v-model="birthDay" scrollable>
                <v-spacer></v-spacer>
                <v-btn text color="primary" @click="birthDayDialog = false">
                  Cancel
                </v-btn>
                <v-btn
                  text
                  color="primary"
                  @click="$refs.dialog.save(birthDay)"
                >
                  OK
                </v-btn>
              </v-date-picker>
            </v-dialog>
            <v-row>
              <v-col cols="3">
                {{ $t('user.message.register.gender') }}
              </v-col>
              <v-radio-group v-model="gender" :rules="genderRules" row>
                <v-radio
                  :label="$t('user.message.register.male')"
                  value="male"
                ></v-radio>
                <v-radio
                  :label="$t('user.message.register.female')"
                  value="female"
                ></v-radio>
                <v-radio
                  :label="$t('user.message.register.other')"
                  value="other"
                ></v-radio>
              </v-radio-group>
            </v-row>
          </div>
          <v-divider class="mx-4"></v-divider>
        </v-form>
        <br />
        <v-btn
          color="success"
          class="text-h6 text-capitalize"
          :disabled="!valid"
          @click="onRegister"
        >
          {{ $t('common.register') }}
        </v-btn>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    const _this = this
    return {
      loading: false,
      error: null,
      dialog: false,
      birthDayDialog: false,
      notifications: false,
      sound: true,
      widgets: false,
      gender: '',
      valid: true,
      name: '',
      email: '',
      password: '',
      select: false,
      birthDay: new Date().toISOString().substr(0, 10),
      nameRules: [
        v => !!v || _this.$t('Rule.NameRequired'),
        v => (!!v && v.length >= 4) || _this.$t('Rule.NameShort'),
        v => (!!v && v.length <= 50) || _this.$t('Rule.NameLong')
      ],
      emailRules: [
        v => !!v || _this.$t('Rule.EmailRequired'),
        v => (!!v && v.length >= 5) || _this.$t('Rule.EmailNotValid'),
        v => (!!v && v.length <= 255) || _this.$t('Rule.EmailLong'),
        v => /.+@.+/.test(v) || _this.$t('Rule.EmailNotValid')
      ],
      passwordRules: [
        v => !!v || _this.$t('Rule.PasswordRequired'),
        v => (!!v && v.length >= 4) || _this.$t('Rule.PasswordShort'),
        v => (!!v && v.length <= 255) || _this.$t('Rule.PasswordLong')
      ],
      genderRules: [v => !!v || 'Gender is required!']
    }
  },
  methods: {
    async onRegister() {
      if (!this.name || !this.email || !this.password || !this.gender) {
        this.$refs.form.validate()
        return
      }
      this.loading = true
      this.error = null
      const user = {
        name: this.name,
        email: this.email,
        password: this.password,
        birthday: this.birthDay,
        gender: this.gender
      }
      try {
        const url = '/auth/register'
        await axios.post(url, user)
        this.loading = false
        this.dialog = false
        this.$emit('success')
      } catch (err) {
        this.error = err.response
        this.loading = false
      }
    }
  }
}
</script>

<style></style>
