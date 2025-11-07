<template>
  <div class="doctor-panel-page">
    <v-container class="py-6" style="max-width: 1400px">
      <div class="text-center mb-8">
        <v-avatar size="100" color="success" class="mb-4">
          <v-icon size="48" color="white">mdi-doctor</v-icon>
        </v-avatar>
        <h1 class="text-h4 font-weight-bold mb-2">پنل مدیریت پزشک</h1>
        <p class="text-body-2 text-medium-emphasis">{{ doctor.name }} - {{ doctor.specialty }}</p>
      </div>

      <v-row>
        <v-col cols="12" md="3">
          <v-card elevation="2" class="mb-4">
            <v-card-title class="pa-4">منو</v-card-title>
            <v-list>
              <v-list-item prepend-icon="mdi-view-dashboard" title="داشبورد" :active="activeTab === 'dashboard'" @click="activeTab = 'dashboard'"></v-list-item>
              <v-list-item prepend-icon="mdi-calendar-clock" title="نوبت‌ها" :active="activeTab === 'appointments'" @click="activeTab = 'appointments'"></v-list-item>
              <v-list-item prepend-icon="mdi-clock-outline" title="مدیریت زمان‌ها" :active="activeTab === 'slots'" @click="activeTab = 'slots'"></v-list-item>
              <v-list-item prepend-icon="mdi-comment-text" title="نظرات" :active="activeTab === 'reviews'" @click="activeTab = 'reviews'"></v-list-item>
              <v-divider class="my-2"></v-divider>
              <v-list-item prepend-icon="mdi-logout" title="خروج" @click="logout"></v-list-item>
            </v-list>
          </v-card>

          <v-card elevation="2">
            <v-card-title class="pa-4">آمار</v-card-title>
            <v-card-text class="pa-4">
              <div class="text-center mb-4">
                <v-icon size="40" color="primary" class="mb-2">mdi-calendar-check</v-icon>
                <div class="text-h4 font-weight-bold mb-1">{{ doctorAppointments.length }}</div>
                <div class="text-caption text-medium-emphasis">کل نوبت‌ها</div>
              </div>
              <v-divider class="my-4"></v-divider>
              <div class="text-center mb-4">
                <v-icon size="40" color="success" class="mb-2">mdi-check-circle</v-icon>
                <div class="text-h4 font-weight-bold mb-1">{{ confirmedCount }}</div>
                <div class="text-caption text-medium-emphasis">تأیید شده</div>
              </div>
              <v-divider class="my-4"></v-divider>
              <div class="text-center">
                <v-icon size="40" color="warning" class="mb-2">mdi-clock-outline</v-icon>
                <div class="text-h4 font-weight-bold mb-1">{{ pendingCount }}</div>
                <div class="text-caption text-medium-emphasis">در انتظار</div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="9">
          <v-card v-if="activeTab === 'dashboard'" elevation="2" class="mb-4">
            <v-card-title class="pa-4">داشبورد</v-card-title>
            <v-card-text class="pa-6">
              <v-row>
                <v-col cols="12" md="6">
                  <v-card variant="outlined" class="pa-4 text-center">
                    <v-icon size="48" color="primary" class="mb-2">mdi-calendar-month</v-icon>
                    <div class="text-h5 font-weight-bold mb-1">امروز</div>
                    <div class="text-h4 font-weight-bold text-primary">{{ todayAppointments }}</div>
                    <div class="text-caption text-medium-emphasis">نوبت امروز</div>
                  </v-card>
                </v-col>
                <v-col cols="12" md="6">
                  <v-card variant="outlined" class="pa-4 text-center">
                    <v-icon size="48" color="info" class="mb-2">mdi-calendar-week</v-icon>
                    <div class="text-h5 font-weight-bold mb-1">این هفته</div>
                    <div class="text-h4 font-weight-bold text-info">{{ weekAppointments }}</div>
                    <div class="text-caption text-medium-emphasis">نوبت این هفته</div>
                  </v-card>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <v-card v-if="activeTab === 'appointments'" elevation="2" class="mb-4">
            <v-card-title class="pa-4">نوبت‌های رزرو شده</v-card-title>
            <v-card-text class="pa-4">
              <div v-if="doctorAppointments.length > 0">
                <v-card v-for="appointment in doctorAppointments" :key="appointment.id" variant="outlined" class="mb-3">
                  <v-card-text class="pa-4">
                    <div class="d-flex align-start">
                      <v-avatar color="success" size="48" class="ml-3">
                        <v-icon color="white">mdi-account</v-icon>
                      </v-avatar>
                      <div class="flex-grow-1">
                        <div class="d-flex align-center justify-space-between mb-2">
                          <h3 class="text-h6 font-weight-bold mb-0">{{ appointment.userName }}</h3>
                          <v-chip :color="getStatusColor(appointment.status)" size="small" variant="flat">
                            {{ getStatusText(appointment.status) }}
                          </v-chip>
                        </div>
                        <div class="d-flex flex-wrap align-center mb-2" style="gap: 8px;">
                          <span class="text-body-2">
                            <v-icon size="14" class="ml-1">mdi-calendar</v-icon>
                            {{ formatDate(appointment.date) }}
                          </span>
                          <span class="text-body-2">
                            <v-icon size="14" class="ml-1">mdi-clock</v-icon>
                            {{ appointment.time }}
                          </span>
                          <span class="text-body-2">
                            <v-icon size="14" class="ml-1">mdi-phone</v-icon>
                            {{ appointment.userPhone }}
                          </span>
                        </div>
                        <div class="text-caption text-medium-emphasis mb-2">کد رزرو: {{ appointment.id }}</div>
                        <div class="d-flex" style="gap: 8px;">
                          <v-btn v-if="appointment.status === 'pending'" color="success" size="small" variant="flat" @click="updateAppointmentStatus(appointment.id, 'confirmed')">
                            <v-icon start size="16">mdi-check</v-icon>
                            تأیید
                          </v-btn>
                          <v-btn v-if="appointment.status !== 'cancelled'" color="error" size="small" variant="outlined" @click="updateAppointmentStatus(appointment.id, 'cancelled')">
                            <v-icon start size="16">mdi-close</v-icon>
                            لغو
                          </v-btn>
                        </div>
                      </div>
                    </div>
                  </v-card-text>
                </v-card>
              </div>
              <v-alert v-else type="info" variant="tonal" class="text-center">
                <v-icon size="48" class="mb-2">mdi-calendar-question</v-icon>
                <div class="text-h6 mb-2">هنوز نوبتی ثبت نشده است</div>
              </v-alert>
            </v-card-text>
          </v-card>

          <v-card v-if="activeTab === 'slots'" elevation="2" class="mb-4">
            <v-card-title class="pa-4">مدیریت زمان‌های در دسترس</v-card-title>
            <v-card-text class="pa-6">
              <v-row>
                <v-col cols="12" md="6">
                  <v-date-picker v-model="newSlotDate" :min="minDate" :max="maxDate" locale="fa" class="mb-4"></v-date-picker>
                </v-col>
                <v-col cols="12" md="6">
                  <v-card variant="outlined" class="pa-4">
                    <h3 class="text-h6 mb-4">افزودن زمان</h3>
                    <v-text-field
                      v-model="newSlotTime"
                      label="زمان (مثال: 09:00)"
                      variant="outlined"
                      prepend-inner-icon="mdi-clock"
                      placeholder="09:00"
                      class="mb-3"
                      density="comfortable"
                    ></v-text-field>
                    <v-btn color="success" variant="elevated" block @click="addTimeSlot" :disabled="!newSlotDate || !newSlotTime">
                      <v-icon start>mdi-plus</v-icon>
                      افزودن زمان
                    </v-btn>
                  </v-card>
                </v-col>
              </v-row>

              <v-divider class="my-6"></v-divider>

              <h3 class="text-h6 mb-4">زمان‌های ثبت شده</h3>
              <v-card v-for="(slot, index) in currentDoctorSlots" :key="index" variant="outlined" class="mb-3">
                <v-card-text class="pa-4">
                  <div class="d-flex align-center justify-space-between">
                    <div>
                      <div class="text-h6 font-weight-bold mb-2">{{ formatDate(slot.date) }}</div>
                      <div class="d-flex flex-wrap" style="gap: 8px;">
                        <v-chip v-for="time in slot.times" :key="time" color="success" size="small" variant="flat">
                          {{ time }}
                        </v-chip>
                      </div>
                    </div>
                    <v-btn icon color="error" variant="text" @click="removeSlot(index)">
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </div>
                </v-card-text>
              </v-card>
            </v-card-text>
          </v-card>

          <v-card v-if="activeTab === 'reviews'" elevation="2" class="mb-4">
            <v-card-title class="pa-4">نظرات بیماران</v-card-title>
            <v-card-text class="pa-4">
              <div v-for="review in currentDoctorReviews" :key="review.id" class="mb-4 pb-4" style="border-bottom: 1px solid rgba(0,0,0,0.12);">
                <div class="d-flex align-start">
                  <v-avatar color="success" size="40" class="ml-3">
                    <span class="text-white">{{ review.user.charAt(0) }}</span>
                  </v-avatar>
                  <div class="flex-grow-1">
                    <div class="d-flex align-center mb-2">
                      <span class="font-weight-bold mr-2">{{ review.user }}</span>
                      <v-rating :model-value="review.rating" color="amber" density="compact" size="small" readonly></v-rating>
                    </div>
                    <p class="text-body-2 mb-0">{{ review.comment }}</p>
                  </div>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'

export default {
  name: 'DoctorPanel',
  data() {
    return {
      activeTab: 'dashboard',
      newSlotDate: null,
      newSlotTime: '',
      minDate: new Date().toISOString().split('T')[0],
      maxDate: (() => {
        const max = new Date()
        max.setDate(max.getDate() + 30)
        return max.toISOString().split('T')[0]
      })()
    }
  },
  computed: {
    ...mapGetters(['getDoctorById', 'getDoctorAppointments', 'isDoctor']),
    doctor() {
      return this.$store.state.doctor
    },
    currentDoctor() {
      if (!this.doctor) return null
      return this.getDoctorById(this.doctor.doctorId)
    },
    doctorAppointments() {
      return this.getDoctorAppointments.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt)
      })
    },
    confirmedCount() {
      return this.doctorAppointments.filter(apt => apt.status === 'confirmed').length
    },
    pendingCount() {
      return this.doctorAppointments.filter(apt => apt.status === 'pending').length
    },
    todayAppointments() {
      const today = new Date().toISOString().split('T')[0]
      return this.doctorAppointments.filter(apt => apt.date === today).length
    },
    weekAppointments() {
      const today = new Date()
      const weekStart = new Date(today)
      weekStart.setDate(today.getDate() - today.getDay())
      return this.doctorAppointments.filter(apt => {
        const aptDate = new Date(apt.date)
        return aptDate >= weekStart && aptDate <= today
      }).length
    },
    currentDoctorSlots() {
      return this.currentDoctor ? this.currentDoctor.availableSlots : []
    },
    currentDoctorReviews() {
      return this.currentDoctor ? this.currentDoctor.reviews : []
    }
  },
  mounted() {
    if (!this.isDoctor) {
      this.$router.push({ name: 'Login' })
    }
  },
  methods: {
    ...mapMutations(['updateAppointment']),
    formatDate(dateString) {
      const date = new Date(dateString)
      const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' }
      return date.toLocaleDateString('fa-IR', options)
    },
    getStatusColor(status) {
      const colors = {
        confirmed: 'success',
        pending: 'warning',
        cancelled: 'error',
        completed: 'info'
      }
      return colors[status] || 'default'
    },
    getStatusText(status) {
      const texts = {
        confirmed: 'تأیید شده',
        pending: 'در انتظار',
        cancelled: 'لغو شده',
        completed: 'انجام شده'
      }
      return texts[status] || status
    },
    updateAppointmentStatus(id, status) {
      this.updateAppointment({ id, appointment: { status } })
    },
    addTimeSlot() {
      if (!this.currentDoctor || !this.newSlotDate || !this.newSlotTime) return
      
      const slots = [...this.currentDoctor.availableSlots]
      const existingSlot = slots.find(s => s.date === this.newSlotDate)
      
      if (existingSlot) {
        if (!existingSlot.times.includes(this.newSlotTime)) {
          existingSlot.times.push(this.newSlotTime)
          existingSlot.times.sort()
        }
      } else {
        slots.push({
          date: this.newSlotDate,
          times: [this.newSlotTime]
        })
        slots.sort((a, b) => new Date(a.date) - new Date(b.date))
      }
      
      this.$store.commit('updateDoctorSlots', {
        doctorId: this.currentDoctor.id,
        slots
      })
      
      this.newSlotTime = ''
    },
    removeSlot(index) {
      if (!this.currentDoctor) return
      const slots = [...this.currentDoctor.availableSlots]
      slots.splice(index, 1)
      this.$store.commit('updateDoctorSlots', {
        doctorId: this.currentDoctor.id,
        slots
      })
    },
    logout() {
      this.$store.dispatch('logout')
      this.$router.push({ name: 'Home' })
    }
  }
}
</script>

<style scoped>
.doctor-panel-page {
  min-height: 100vh;
}
</style>
