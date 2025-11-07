<template>
  <div class="booking-page">
    <v-container v-if="doctor" class="py-6" style="max-width: 800px">
      <!-- Back Button -->
      <v-btn
        icon
        variant="text"
        @click="$router.back()"
        class="mb-4"
        color="primary"
        size="large"
      >
        <v-icon size="24">mdi-arrow-right</v-icon>
      </v-btn>

      <v-card class="clean-card" elevation="2">
        <v-stepper v-model="step" elevation="0">
          <v-stepper-header class="pa-4">
            <v-stepper-item
              :complete="step > 1"
              title="انتخاب تاریخ و زمان"
              value="1"
            >
              <template v-slot:icon>
                <v-icon :color="step >= 1 ? 'primary' : 'grey'">mdi-calendar-clock</v-icon>
              </template>
            </v-stepper-item>
            <v-divider></v-divider>
            <v-stepper-item
              :complete="step > 2"
              title="تأیید اطلاعات"
              value="2"
            >
              <template v-slot:icon>
                <v-icon :color="step >= 2 ? 'primary' : 'grey'">mdi-account-check</v-icon>
              </template>
            </v-stepper-item>
            <v-divider></v-divider>
            <v-stepper-item
              title="تأیید نهایی"
              value="3"
            >
              <template v-slot:icon>
                <v-icon :color="step >= 3 ? 'success' : 'grey'">mdi-check-circle</v-icon>
              </template>
            </v-stepper-item>
          </v-stepper-header>

          <v-stepper-window>
            <!-- Step 1 -->
            <v-stepper-window-item value="1">
              <v-card-text class="pa-6">
                <div class="text-center mb-6">
                  <v-icon color="primary" size="64" class="mb-4">mdi-calendar-clock</v-icon>
                  <h2 class="text-h5 font-weight-bold mb-2">انتخاب تاریخ و زمان</h2>
                  <div class="d-flex justify-center gap-2 mb-4">
                    <v-chip color="primary" size="small" variant="flat">
                      <v-icon start size="16">mdi-doctor</v-icon>
                      {{ doctor.name }}
                    </v-chip>
                    <v-chip color="secondary" size="small" variant="flat">
                      <v-icon start size="16">mdi-medical-bag</v-icon>
                      {{ doctor.specialty }}
                    </v-chip>
                  </div>
                </div>

                <v-card class="mb-4" elevation="0" variant="outlined">
                  <v-date-picker
                    v-model="selectedDate"
                    :min="minDate"
                    :max="maxDate"
                    locale="fa"
                    @update:model-value="onDateChange"
                  ></v-date-picker>
                </v-card>

                <div v-if="availableTimes.length > 0" class="mt-4">
                  <h3 class="text-h6 mb-3">
                    <v-icon size="20" class="mr-2">mdi-clock-outline</v-icon>
                    زمان‌های در دسترس:
                  </h3>
                  <div class="d-flex flex-wrap gap-2">
                    <v-chip
                      v-for="time in availableTimes"
                      :key="time"
                      :class="['time-chip', { selected: selectedTime === time }]"
                      @click="selectedTime = time"
                    >
                      <v-icon start size="18">mdi-clock</v-icon>
                      {{ time }}
                    </v-chip>
                  </div>
                </div>

                <v-alert
                  v-else-if="selectedDate"
                  type="info"
                  variant="tonal"
                  class="mt-4"
                  border="start"
                >
                  <v-icon start>mdi-information</v-icon>
                  برای این تاریخ زمانی در دسترس نیست.
                </v-alert>

                <v-card-actions class="justify-end mt-6">
                  <v-btn
                    color="primary"
                    variant="elevated"
                    :disabled="!selectedDate || !selectedTime"
                    @click="step = 2"
                    class="clean-btn"
                    size="large"
                  >
                    <v-icon start>mdi-arrow-left</v-icon>
                    ادامه
                    <v-icon end>mdi-chevron-left</v-icon>
                  </v-btn>
                </v-card-actions>
              </v-card-text>
            </v-stepper-window-item>

            <!-- Step 2 -->
            <v-stepper-window-item value="2">
              <v-card-text class="pa-6">
                <div class="text-center mb-6">
                  <v-icon color="primary" size="64" class="mb-4">mdi-account-check</v-icon>
                  <h2 class="text-h5 font-weight-bold mb-2">تأیید اطلاعات</h2>
                </div>

                <v-card class="mb-4 clean-card" elevation="0" variant="outlined">
                  <v-card-title class="pa-4">
                    <v-icon color="primary" class="mr-2">mdi-calendar-text</v-icon>
                    اطلاعات نوبت
                  </v-card-title>
                  <v-card-text class="pa-4 pt-0">
                    <div class="info-row mb-3">
                      <v-icon color="primary" class="mr-3">mdi-doctor</v-icon>
                      <div>
                        <span class="text-caption text-medium-emphasis">پزشک:</span>
                        <div class="text-body-1 font-weight-bold">{{ doctor.name }}</div>
                      </div>
                    </div>
                    <div class="info-row mb-3">
                      <v-icon color="primary" class="mr-3">mdi-medical-bag</v-icon>
                      <div>
                        <span class="text-caption text-medium-emphasis">تخصص:</span>
                        <div class="text-body-1 font-weight-bold">{{ doctor.specialty }}</div>
                      </div>
                    </div>
                    <div class="info-row mb-3">
                      <v-icon color="primary" class="mr-3">mdi-calendar</v-icon>
                      <div>
                        <span class="text-caption text-medium-emphasis">تاریخ:</span>
                        <div class="text-body-1 font-weight-bold">{{ formatDate(selectedDate) }}</div>
                      </div>
                    </div>
                    <div class="info-row">
                      <v-icon color="primary" class="mr-3">mdi-clock</v-icon>
                      <div>
                        <span class="text-caption text-medium-emphasis">زمان:</span>
                        <div class="text-body-1 font-weight-bold">{{ selectedTime }}</div>
                      </div>
                    </div>
                  </v-card-text>
                </v-card>

                <v-card class="mb-4 clean-card" elevation="0" variant="outlined">
                  <v-card-title class="pa-4">
                    <v-icon color="primary" class="mr-2">mdi-account</v-icon>
                    اطلاعات کاربر
                  </v-card-title>
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
                  <v-btn
                    variant="outlined"
                    @click="step = 1"
                    class="clean-btn"
                    size="large"
                  >
                    <v-icon start>mdi-arrow-right</v-icon>
                    بازگشت
                  </v-btn>
                  <v-btn
                    color="primary"
                    variant="elevated"
                    :disabled="!isUserInfoValid"
                    @click="confirmBooking"
                    class="clean-btn"
                    size="large"
                  >
                    <v-icon start>mdi-check</v-icon>
                    تأیید و رزرو
                    <v-icon end>mdi-calendar-check</v-icon>
                  </v-btn>
                </v-card-actions>
              </v-card-text>
            </v-stepper-window-item>

            <!-- Step 3 -->
            <v-stepper-window-item value="3">
              <v-card-text class="pa-6 text-center">
                <div class="success-icon mb-4">
                  <v-icon
                    color="success"
                    size="100"
                  >
                    mdi-check-circle
                  </v-icon>
                </div>
                <h2 class="text-h4 font-weight-bold mb-4 text-primary">
                  <v-icon size="32" class="mr-2">mdi-check-circle</v-icon>
                  رزرو با موفقیت انجام شد!
                </h2>
                
                <v-card class="mb-4 clean-card mx-auto" style="max-width: 500px;" elevation="0" variant="outlined">
                  <v-card-title class="pa-4">
                    <v-icon color="primary" class="mr-2">mdi-ticket-confirmation</v-icon>
                    جزئیات نوبت
                  </v-card-title>
                  <v-card-text class="pa-4 pt-0">
                    <div class="info-row mb-3">
                      <v-icon color="primary" class="mr-3">mdi-barcode</v-icon>
                      <div>
                        <span class="text-caption text-medium-emphasis">کد رزرو:</span>
                        <div class="text-h6 font-weight-bold text-primary">{{ bookingId }}</div>
                      </div>
                    </div>
                    <v-divider class="my-3"></v-divider>
                    <div class="info-row mb-3">
                      <v-icon color="primary" class="mr-3">mdi-doctor</v-icon>
                      <div>
                        <span class="text-caption text-medium-emphasis">پزشک:</span>
                        <div class="text-body-1 font-weight-bold">{{ doctor.name }}</div>
                      </div>
                    </div>
                    <div class="info-row mb-3">
                      <v-icon color="primary" class="mr-3">mdi-calendar</v-icon>
                      <div>
                        <span class="text-caption text-medium-emphasis">تاریخ:</span>
                        <div class="text-body-1 font-weight-bold">{{ formatDate(selectedDate) }}</div>
                      </div>
                    </div>
                    <div class="info-row">
                      <v-icon color="primary" class="mr-3">mdi-clock</v-icon>
                      <div>
                        <span class="text-caption text-medium-emphasis">زمان:</span>
                        <div class="text-body-1 font-weight-bold">{{ selectedTime }}</div>
                      </div>
                    </div>
                  </v-card-text>
                </v-card>

                <v-alert type="success" variant="tonal" class="mb-4" border="start">
                  <v-icon start>mdi-information</v-icon>
                  لطفاً 15 دقیقه قبل از زمان نوبت در مطب حضور داشته باشید.
                </v-alert>

                <div class="d-flex justify-center gap-2">
                  <v-btn
                    color="primary"
                    variant="elevated"
                    @click="goToProfile"
                    class="clean-btn"
                    size="large"
                  >
                    <v-icon start>mdi-account</v-icon>
                    مشاهده پروفایل
                  </v-btn>
                  <v-btn
                    variant="outlined"
                    @click="goToHome"
                    class="clean-btn"
                    size="large"
                  >
                    <v-icon start>mdi-home</v-icon>
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

.info-row {
  display: flex;
  align-items: flex-start;
}

.success-icon {
  animation: scaleIn 0.5s ease-out;
}

@keyframes scaleIn {
  from {
    transform: scale(0);
  }
  to {
    transform: scale(1);
  }
}

.gap-2 {
  gap: 8px;
}
</style>
