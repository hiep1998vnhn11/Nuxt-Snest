<template>
  <v-card class="rounded-lg mt-3">
    <v-container>
      <div class="font-weight-black text-body-1">
        {{ $t('profile.Intro') }}
      </div>
      <div v-if="user.info.jobs.length">
        <v-icon>mdi-bag-checked</v-icon>
        {{ $t('profile.Work') }}
        <span>
          {{ user.info.jobs[0].details }}
          at
          {{ user.info.jobs[0].workspace }}
        </span>
      </div>
      <div v-if="user.info.educates.length">
        <v-icon>mdi-book-open-variant</v-icon>
        {{ $t('profile.WentTo') }}
        <span>
          {{ user.info.educates[0].details }}
          at
          {{ user.info.educates[0].school }}
        </span>
      </div>
      <div v-if="user.info.show_live_at">
        <v-icon>mdi-home-map-marker</v-icon>
        {{ $t('profile.LivesIn') }}
        <span class="primary--text">
          {{ user.info.live_at }}
        </span>
      </div>
      <div v-if="user.info.show_from">
        <v-icon>mdi-map-marker</v-icon>
        <span>{{ $t('profile.From') }}</span>
      </div>
      <div v-if="current">
        <v-btn
          text
          outlined
          block
          class="text-capitalize font-weight-bold text-caption mt-2"
          @click="dialog = true"
        >
          Edit introduce
        </v-btn>
        <v-btn
          text
          outlined
          block
          class="text-capitalize font-weight-bold text-caption mt-2"
        >
          Add some info
        </v-btn>
        <v-btn
          text
          outlined
          block
          class="text-capitalize font-weight-bold text-caption mt-2"
        >
          Edit highlight
        </v-btn>
      </div>
    </v-container>
    <v-dialog
      :value="dialog"
      max-width="700"
      scrollable
      @click:outside="dialog = false"
      @keydown.esc="dialog = false"
    >
      <v-card>
        <v-card-title>
          Edit introduce
          <v-spacer></v-spacer>
          <v-btn @click="dialog = false" icon class="grey lighten-2">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-container class="text-body-2">
            <div class="font-weight-bold">
              Edit your introduce by yourself!
            </div>
            Your selected details will be displayed publicly.
            <div class="font-weight-bold mt-5 mb-3">
              Jobs
            </div>
            {{ user.info.jobs }}
            <v-switch
              v-for="job in user.info.jobs"
              :key="job.workspace + job.details"
              v-model="job.status"
              inset
              :label="`${job.details} at ${job.workspace}`"
              class="mb-n4"
            ></v-switch>
            <v-switch
              v-for="job in jobs"
              :key="job.workspace + job.details"
              v-model="job.status"
              inset
              :label="`${job.details} at ${job.workspace}`"
              class="mb-n4"
            ></v-switch>

            <div
              class="font-weight-bold mt-5 mb-3"
              v-if="currentJob.workspace || currentJob.details"
            >
              <v-switch
                v-model="currentJob.status"
                inset
                :label="`${currentJob.details} at ${currentJob.workspace}`"
              ></v-switch>
            </div>
            <v-row v-if="status === 'job'" class="mb-n4">
              <v-col cols="7">
                <v-text-field
                  dense
                  rounded
                  outlined
                  label="Details"
                  v-model="currentJob.details"
                  @keyup.enter="saveJob"
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  dense
                  rounded
                  outlined
                  label="Workspace"
                  v-model="currentJob.workspace"
                  @keyup.enter="saveJob"
                ></v-text-field>
              </v-col>
              <v-col cols="1">
                <v-btn icon @click="saveJob">
                  <v-icon color="primary">mdi-check</v-icon>
                </v-btn>
              </v-col>
            </v-row>

            <v-btn
              block
              text
              outlined
              class="text-capitalize mt-2"
              color="primary"
              @click="status = 'job'"
            >
              <v-icon class="mr-2">mdi-plus-circle-outline</v-icon>
              Add your workplace
              <v-spacer></v-spacer>
            </v-btn>
            <div class="font-weight-bold mt-6 mb-3">
              Educate
            </div>
            <v-switch
              v-for="job in user.info.educates"
              :key="job.school + job.details"
              v-model="job.status"
              inset
              :label="`${job.details} at ${job.school}`"
              class="mb-n4"
            ></v-switch>
            <v-switch
              v-for="edu in educates"
              :key="edu.school + edu.details"
              v-model="edu.status"
              inset
              :label="`${edu.details} at ${edu.school}`"
              class="mb-n4"
            ></v-switch>
            <div
              class="font-weight-bold mt-5 mb-3"
              v-if="currentEducate.school || currentEducate.details"
            >
              <v-switch
                v-model="currentEducate.status"
                inset
                :label="`${currentEducate.details} at ${currentEducate.school}`"
              ></v-switch>
            </div>
            <v-row class="mt-4 mb-n4" v-if="status === 'school'">
              <v-col cols="7">
                <v-text-field
                  dense
                  rounded
                  outlined
                  label="Details"
                  v-model="currentEducate.details"
                  @keyup.enter="saveSchool"
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  dense
                  rounded
                  outlined
                  label="Workspace"
                  v-model="currentEducate.school"
                  @keyup.enter="saveSchool"
                ></v-text-field>
              </v-col>
              <v-col cols="1">
                <v-btn icon @click="saveSchool">
                  <v-icon color="primary">mdi-check</v-icon>
                </v-btn>
              </v-col>
            </v-row>
            <v-btn
              block
              text
              outlined
              class="text-capitalize mt-2"
              color="primary"
              @click="status = 'school'"
            >
              <v-icon class="mr-2">mdi-plus-circle-outline</v-icon>
              Add your school
              <v-spacer></v-spacer>
            </v-btn>

            <div class="font-weight-bold mt-6 mb-3">
              City/Town you are living
            </div>
            <v-row
              v-if="user.info.live_at && status !== 'live_at' && !liveAtEdited"
            >
              <v-switch
                inset
                class="mb-n6"
                v-model="user.info.show_live_at"
                @change="liveAtStatus = user.info.show_live_at"
              ></v-switch>
              <v-col>
                <v-list-item-title
                  v-text="user.info.live_at"
                ></v-list-item-title>
                <v-list-item-subtitle v-if="user.info.show_live_at">
                  {{ showMessage }}
                </v-list-item-subtitle>
                <v-list-item-subtitle v-else>
                  {{ hiddenMessage }}
                </v-list-item-subtitle>
              </v-col>
              <v-spacer />
              <v-btn icon @click="onEditLiveAt">
                <v-icon color="primary">
                  mdi-pencil
                </v-icon>
              </v-btn>
            </v-row>

            <v-row v-else-if="!liveAtEdited" class="ml-0 mb-n6">
              <v-text-field
                dense
                rounded
                outlined
                label="Enter your City/Town you are living ..."
                v-model="liveAt"
                @keyup.enter="saveLiveAt"
              ></v-text-field>
              <v-btn icon class="ml-3" @click="saveLiveAt">
                <v-icon color="primary">mdi-check</v-icon>
              </v-btn>
            </v-row>
            <v-row v-if="liveAt">
              <v-switch inset v-model="liveAtStatus" class="mb-n6"></v-switch>
              <v-col>
                <v-list-item-title v-text="liveAt"></v-list-item-title>
                <v-list-item-subtitle v-if="liveAtStatus">
                  {{ showMessage }}
                </v-list-item-subtitle>
                <v-list-item-subtitle v-else>
                  {{ hiddenMessage }}
                </v-list-item-subtitle>
              </v-col>
              <v-spacer />
              <v-btn icon class="my-auto">
                <v-icon color="primary" @click="onEditLiveAt">
                  mdi-pencil
                </v-icon>
              </v-btn>
            </v-row>
            <div class="font-weight-bold mt-6 mb-3">
              From
            </div>
            <v-row v-if="user.info.from && status !== 'from' && !fromEdited">
              <v-switch
                inset
                class="mb-n6"
                v-model="user.info.show_from"
                @change="fromStatus = user.info.show_from"
              ></v-switch>
              <v-col>
                <v-list-item-title v-text="user.info.from"></v-list-item-title>
                <v-list-item-subtitle v-if="user.info.show_from">
                  {{ showMessage }}
                </v-list-item-subtitle>
                <v-list-item-subtitle v-else>
                  {{ hiddenMessage }}
                </v-list-item-subtitle>
              </v-col>
              <v-spacer />
              <v-btn icon @click="onEditFrom">
                <v-icon color="primary">
                  mdi-pencil
                </v-icon>
              </v-btn>
            </v-row>

            <v-row v-else-if="!fromEdited" class="ml-0 mb-n6">
              <v-text-field
                dense
                rounded
                outlined
                label="Enter your City/Town you are living ..."
                v-model="from"
                @keyup.enter="saveFrom"
              ></v-text-field>
              <v-btn icon class="ml-3" @click="saveFrom">
                <v-icon color="primary">mdi-check</v-icon>
              </v-btn>
            </v-row>
            <v-row v-if="from">
              <v-switch inset v-model="fromStatus" class="mb-n6"></v-switch>
              <v-col>
                <v-list-item-title v-text="from"></v-list-item-title>
                <v-list-item-subtitle v-if="fromStatus">
                  {{ showMessage }}
                </v-list-item-subtitle>
                <v-list-item-subtitle v-else>
                  {{ hiddenMessage }}
                </v-list-item-subtitle>
              </v-col>
              <v-spacer />
              <v-btn icon class="my-auto">
                <v-icon color="primary" @click="onEditFrom">
                  mdi-pencil
                </v-icon>
              </v-btn>
            </v-row>
          </v-container>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn
            text
            class="text-capitalize primary--text"
            @click="dialog = false"
            :to="localePath({ name: 'user-url-about' })"
          >
            Update your infomation
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn text outlined class="text-capitalize" @click="onCancel">
            Cancel
          </v-btn>
          <v-btn
            width="100"
            class="text-capitalize primary"
            text
            @click="onSave"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="warningDialog" width="500">
      <v-card>
        <v-card-title class="headline">
          Warning
          <v-spacer />
          <v-btn @click="warningDialog = false" icon class="grey lighten-2">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider />
        <v-card-text>
          Are you sure about close this change?
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="onAcceptWarning">
            I accept
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  props: {
    user: Object
  },
  data() {
    return {
      dialog: false,
      warningDialog: false,
      test: true,
      jobs: [],
      currentJob: {
        workspace: '',
        details: '',
        status: true
      },
      educates: [],
      currentEducate: {
        school: '',
        details: '',
        status: true
      },
      status: null,
      text: null,
      details: null,
      liveAt: null,
      liveAtStatus: true,
      liveAtEdited: false,
      from: null,
      fromStatus: true,
      fromEdited: false,
      hiddenMessage: 'Will not show in this introduce but still public',
      showMessage: 'Will show in this introduce and still public'
    }
  },
  computed: {
    ...mapGetters('user', ['currentUser']),
    current() {
      return this.currentUser ? this.currentUser.id === this.user.id : false
    }
  },
  methods: {
    saveSchool() {
      if (!this.currentEducate.details || !this.currentEducate.school) return
      let duplicated = false
      const _this = this
      this.educates.forEach(edu => {
        if (
          edu.details === _this.currentEducate.details &&
          edu.school === _this.currentEducate.school
        ) {
          duplicated = true
        }
      })
      if (duplicated) return
      this.educates.push({
        details: this.currentEducate.details,
        school: this.currentEducate.school,
        status: this.currentEducate.status
      })
      this.currentEducate.details = this.currentEducate.school = ''
      this.status = null
    },
    saveJob() {
      if (!this.currentJob.details || !this.currentJob.workspace) return
      let duplicated = false
      const _this = this
      this.jobs.forEach(job => {
        if (
          job.details === _this.currentJob.details &&
          job.workspace === _this.currentJob.workspace
        ) {
          duplicated = true
        }
      })
      if (duplicated) return
      this.jobs.push({
        details: this.currentJob.details,
        workspace: this.currentJob.workspace,
        status: this.currentJob.status
      })
      this.currentJob.details = this.currentJob.workspace = ''
      this.status = null
    },
    saveCollege() {
      console.log(this.text)
      this.text = null
      this.status = null
    },
    saveCity() {
      console.log(this.text)
      this.text = null
      this.status = null
    },
    saveLiveAt() {
      this.text = null
      this.status = null
      this.user.info.live_at === this.liveAt
        ? (this.liveAtEdited = false)
        : (this.liveAtEdited = true)
    },
    saveFrom() {
      this.text = null
      this.status = null
      this.user.info.from === this.from
        ? (this.fromEdited = false)
        : (this.fromEdited = true)
    },
    testa() {
      console.log(this.currentJob)
    },
    onSave() {
      const info = {
        jobs: this.jobs,
        live_at: this.live_at,
        show_live_at: this.liveAtStatus,
        from: this.from,
        show_from: this.fromStatus
      }
      console.log(info)
    },
    onCancel() {
      if (
        this.currentJob.details ||
        this.currentJob.workspace ||
        !this.currentJob.status ||
        this.currentEducate.details ||
        this.currentEducate.school ||
        !this.currentEducate.status ||
        this.jobs.length ||
        this.educates.length ||
        this.liveAt ||
        this.from
      ) {
        this.warningDialog = true
      } else this.dialog = false
    },
    onAcceptWarning() {
      this.warningDialog = false
      this.jobs = []
      this.currentJob = {
        workspace: '',
        details: '',
        status: true
      }
      this.educates = []
      this.currentEducate = {
        school: '',
        details: '',
        status: true
      }
      this.status = null
      this.text = null
      this.details = null
      this.liveAt = null
      this.liveAtStatus = true
      this.liveAtEdited = false
      this.from = null
      this.fromStatus = true
      this.fromEdited = false
    },
    onEditLiveAt() {
      this.liveAt = this.user.info.live_at
      this.status = 'live_at'
    },
    onEditFrom() {
      this.from = this.user.info.from
      this.status = 'from'
    }
  }
}
</script>

<style></style>
