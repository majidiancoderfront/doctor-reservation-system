<template>
  <div class="booking-page">
    <v-container v-if="doctor" class="py-6" style="max-width: 800px">
      <v-btn icon variant="text" @click="$router.back()" class="mb-4">
        <v-icon>mdi-arrow-right</v-icon>
      </v-btn>

      <v-card elevation="2">
        <v-stepper v-model="step">
          <v-stepper-header>
            <v-stepper-item :complete="step > 1" title="انتخاب تاریخ و زمان" value="1"></v-stepper-item>
            <v-divider></v-divider>
            <v-stepper-item :complete="step > 2" title="تأیید اطلاعات" value="2"></v-stepper-item>
            <v-divider></v-divider>
            <v-stepper-item title="تأیید نهایی" value="3"></v-stepper-item>
          </v-stepper-header>

          <v-stepper-window>
            <v-stepper-window-item value="1">
              <v-card-text class="pa-6">
                <div class="text-center mb-6">
                  <h2 class="text-h5 font-weight-bold mb-2">انتخاب تاریخ و زمان</h2>
                  <div class="d-flex justify-center" style="gap: 8px;">
                    <v-chip color="primary" size="small">{{ doctor.name }}</v-chip>
                    <v-chip color="secondary" size="small">{{ doctor.specialty }}</v-chip>
                  </div>
                </div>

                <v-card variant="outlined" class="mb-4">
                  <v-date-picker
                    v-model="selectedDate"
                    :min="minDate"
                    :max="maxDate"
                    locale="fa"
                    @update:model-value="onDateChange"
                  ></v-date-picker>
                </v-card>

                <div v-if="availableTimes.length > 0" class="mt-4">
                  <h3 class="text-h6 mb-3">زمان‌های در دسترس:</h3>
                  <div class="d-flex flex-wrap" style="gap: 8px;">
                    <v-chip
                      v-for="time in availableTimes"
                      :key="time"
                      :color="selectedTime === time ? 'primary' : 'default'"
                      @click="selectedTime = time"
                      style="cursor: pointer;"
                    >
                      {{ time }}
                    </v-chip>
                  </div>
                </div>

                <v-alert v-else-if="selectedDate" type="info" variant="tonal" class="mt-4">
                  برای این تاریخ زمانی در دسترس نیست.
                </v-alert>

                <v-card-actions class="justify-end mt-6">
                  <v-btn color="primary" variant="elevated" :disabled="!selectedDate || !selectedTime" @click="step = 2">
                    ادامه
                    <v-icon end>mdi-arrow-left</v-icon>
                  </v-btn>
                </v-card-actions>
              </v-card-text>
            </v-stepper-window-item>

            <v-stepper-window-item value="2">
              <v-card-text class="pa-6">
                <div class="text-center mb-6">
                  <h2 class="text-h5 font-weight-bold mb-2">تأیید اطلاعات</h2>
                </div>

                <v-card variant="outlined" class="mb-4">
                  <v-card-title class="pa-4">اطلاعات نوبت</v-card-title>
                  <v-card-text class="pa-4 pt-0">
                    <div class="mb-3">
                      <span class="text-caption text-medium-emphasis">پزشک:</span>
                      <div class="font-weight-bold">{{ doctor.name }}</div>
                    </div>
                    <div class="mb-3">
                      <span class="text-caption text-medium-emphasis">تخصص:</span>
                      <div class="font-weight-bold">{{ doctor.specialty }}</div>
                    </div>
                    <div class="mb-3">
                      <span class="text-caption text-medium-emphasis">تاریخ:</span>
                      <div class="font-weight-bold">{{ formatDate(selectedDate) }}</div>
                    </div>
                    <div>
                      <span class="text-caption text-medium-emphasis">زمان:</span>
                      <div class="font-weight-bold">{{ selectedTime }}</div>
                    </div>
                  </v-card-text>
                </v-card>

                <v-card variant="outlined" class="mb-4">
                  <v-card-title class="pa-4">اطلاعات کاربر</v-card-title>
                  <v-card-text class="pa-4 pt-0">
                    <v-text-field
                      v-model="userInfo.name"
                      label="نام و نام خانوادگی"
                      variant="outlined"
                      prepend-inner-icon="mdi-account"
                      class="mb-3"
                      density="comfortable"
                    ></v-text-field>
                    <v-text-field
                      v-model="userInfo.phone"
                      label="شماره تماس"
                      variant="outlined"
                      prepend-inner-icon="mdi-phone"
                      class="mb-3"
                      density="comfortable"
                    ></v-text-field>
                    <v-text-field
                      v-model="userInfo.email"
                      label="ایمیل"
                      variant="outlined"
                      prepend-inner-icon="mdi-email"
                      density="comfortable"
                    ></v-text-field>
                  </v-card-text>
                </v-card>

                <v-card-actions class="justify-space-between">
                  <v-btn variant="outlined" @click="step = 1">
                    <v-icon start>mdi-arrow-right</v-icon>
                    بازگشت
                  </v-btn>
                  <v-btn color="primary" variant="elevated" :disabled="!isUserInfoValid" @click="confirmBooking">
                    تأیید و رزرو
                    <v-icon end>mdi-check</v-icon>
                  </v-btn>
                </v-card-actions>
              </v-card-text>
            </v-stepper-window-item>

            <v-stepper-window-item value="3">
              <v-card-text class="pa-6 text-center">
                <v-icon color="success" size="80" class="mb-4">mdi-check-circle</v-icon>
                <h2 class="text-h4 font-weight-bold mb-4 text-primary">
                  رزرو با موفقیت انجام شد!
                </h2>
                
                <v-card variant="outlined" class="mb-4 mx-auto" style="max-width: 500px;">
                  <v-card-title class="pa-4">جزئیات نوبت</v-card-title>
                  <v-card-text class="pa-4 pt-0">
                    <div class="mb-3">
                      <span class="text-caption text-medium-emphasis">کد رزرو:</span>
                      <div class="text-h6 font-weight-bold text-primary">{{ bookingId }}</div>
                    </div>
                    <v-divider class="my-3"></v-divider>
                    <div class="mb-3">
                      <span class="text-caption text-medium-emphasis">پزشک:</span>
                      <div class="font-weight-bold">{{ doctor.name }}</div>
                    </div>
                    <div class="mb-3">
                      <span class="text-caption text-medium-emphasis">تاریخ:</span>
                      <div class="font-weight-bold">{{ formatDate(selectedDate) }}</div>
                    </div>
                    <div>
                      <span class="text-caption text-medium-emphasis">زمان:</span>
                      <div class="font-weight-bold">{{ selectedTime }}</div>
                    </div>
                  </v-card-text>
                </v-card>

                <v-alert type="success" variant="tonal" class="mb-4">
                  لطفاً 15 دقیقه قبل از زمان نوبت در مطب حضور داشته باشید.
                </v-alert>

                <div class="d-flex justify-center" style="gap: 8px;">
                  <v-btn color="primary" variant="elevated" @click="goToProfile">
                    مشاهده پروفایل
                  </v-btn>
                  <v-btn variant="outlined" @click="goToHome">
                    بازگشت به صفحه اصلی
                  </v-btn>
                </div>
              </v-card-text>
            </v-stepper-window-item>
          </v-stepper-window>
        </v-stepper>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'Booking',
  props: {
    doctorId: {
      type: [String, Number],
      required: true
    }
  },
  data() {
    return {
      step: 1,
      selectedDate: null,
      selectedTime: null,
      bookingId: null,
      userInfo: {
        name: '',
        phone: '',
        email: ''
      }
    }
  },
  computed: {
    ...mapGetters(['getDoctorById']),
    doctor() {
      return this.getDoctorById(this.doctorId)
    },
    minDate() {
      const today = new Date()
      return today.toISOString().split('T')[0]
    },
    maxDate() {
      const max = new Date()
      max.setDate(max.getDate() + 30)
      return max.toISOString().split('T')[0]
    },
    availableTimes() {
      if (!this.selectedDate || !this.doctor) return []
      const slot = this.doctor.availableSlots.find(s => s.date === this.selectedDate)
      return slot ? slot.times : []
    },
    isUserInfoValid() {
      return this.userInfo.name && this.userInfo.phone && this.userInfo.email
    }
  },
  mounted() {
    if (this.$route.query.date) {
      this.selectedDate = this.$route.query.date
    }
    if (this.$route.query.time) {
      this.selectedTime = this.$route.query.time
    }
    if (this.$store.state.user) {
      this.userInfo = {
        name: this.$store.state.user.name || '',
        phone: this.$store.state.user.phone || '',
        email: this.$store.state.user.email || ''
      }
    }
  },
  methods: {
    ...mapActions(['bookAppointment']),
    formatDate(dateString) {
      if (!dateString) return ''
      const date = new Date(dateString)
      const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' }
      return date.toLocaleDateString('fa-IR', options)
    },
    onDateChange() {
      this.selectedTime = null
    },
    async confirmBooking() {
      try {
        const appointment = await this.bookAppointment({
          doctorId: this.doctor.id,
          doctorName: this.doctor.name,
          doctorSpecialty: this.doctor.specialty,
          date: this.selectedDate,
          time: this.selectedTime,
          userId: this.$store.state.user.id,
          userName: this.userInfo.name,
          userPhone: this.userInfo.phone,
          userEmail: this.userInfo.email
        })
        this.bookingId = appointment.id
        this.step = 3
      } catch (error) {
        console.error('Error booking appointment:', error)
      }
    },
    goToProfile() {
      this.$router.push({ name: 'Profile' })
    },
    goToHome() {
      this.$router.push({ name: 'Home' })
    }
  }
}
</script>

<style scoped>
.booking-page {
  min-height: 100vh;
}
</style>
