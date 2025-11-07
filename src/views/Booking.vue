<template>
  <v-container v-if="doctor" class="pa-4" style="max-width: 800px">
    <v-btn
      icon
      @click="$router.back()"
      class="mb-4"
      color="primary"
    >
      <v-icon>mdi-arrow-right</v-icon>
    </v-btn>

    <v-stepper
      v-model="step"
      elevation="2"
      class="booking-stepper"
    >
      <v-stepper-header>
        <v-stepper-item
          :complete="step > 1"
          title="انتخاب تاریخ و زمان"
          value="1"
        ></v-stepper-item>
        <v-stepper-item
          :complete="step > 2"
          title="تأیید اطلاعات"
          value="2"
        ></v-stepper-item>
        <v-stepper-item
          title="تأیید نهایی"
          value="3"
        ></v-stepper-item>
      </v-stepper-header>

      <v-stepper-window>
        <!-- Step 1: Date and Time Selection -->
        <v-stepper-window-item value="1">
          <v-card elevation="0" class="pa-6">
            <v-card-title class="text-h5 mb-4">
              انتخاب تاریخ و زمان
            </v-card-title>

            <v-card-subtitle class="mb-4">
              <v-chip color="primary" size="small" class="mr-2">
                {{ doctor.name }}
              </v-chip>
              <v-chip color="secondary" size="small">
                {{ doctor.specialty }}
              </v-chip>
            </v-card-subtitle>

            <v-date-picker
              v-model="selectedDate"
              :min="minDate"
              :max="maxDate"
              locale="fa"
              class="mb-4"
              @update:model-value="onDateChange"
            ></v-date-picker>

            <div v-if="availableTimes.length > 0" class="mt-4">
              <h3 class="mb-3">زمان‌های در دسترس:</h3>
              <div class="d-flex flex-wrap gap-2">
                <v-chip
                  v-for="time in availableTimes"
                  :key="time"
                  :color="selectedTime === time ? 'primary' : 'default'"
                  size="large"
                  @click="selectedTime = time"
                  class="time-chip"
                >
                  {{ time }}
                </v-chip>
              </div>
            </div>

            <v-alert
              v-else-if="selectedDate"
              type="info"
              class="mt-4"
            >
              برای این تاریخ زمانی در دسترس نیست.
            </v-alert>

            <v-card-actions class="justify-end mt-6">
              <v-btn
                color="primary"
                variant="elevated"
                :disabled="!selectedDate || !selectedTime"
                @click="step = 2"
              >
                ادامه
                <v-icon end>mdi-arrow-left</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-stepper-window-item>

        <!-- Step 2: User Information Confirmation -->
        <v-stepper-window-item value="2">
          <v-card elevation="0" class="pa-6">
            <v-card-title class="text-h5 mb-4">
              تأیید اطلاعات
            </v-card-title>

            <v-card class="mb-4" elevation="1">
              <v-card-title>اطلاعات نوبت</v-card-title>
              <v-card-text>
                <div class="mb-2">
                  <strong>پزشک:</strong> {{ doctor.name }}
                </div>
                <div class="mb-2">
                  <strong>تخصص:</strong> {{ doctor.specialty }}
                </div>
                <div class="mb-2">
                  <strong>تاریخ:</strong> {{ formatDate(selectedDate) }}
                </div>
                <div>
                  <strong>زمان:</strong> {{ selectedTime }}
                </div>
              </v-card-text>
            </v-card>

            <v-card class="mb-4" elevation="1">
              <v-card-title>اطلاعات کاربر</v-card-title>
              <v-card-text>
                <v-text-field
                  v-model="userInfo.name"
                  label="نام و نام خانوادگی"
                  variant="outlined"
                  prepend-inner-icon="mdi-account"
                  class="mb-2"
                ></v-text-field>
                <v-text-field
                  v-model="userInfo.phone"
                  label="شماره تماس"
                  variant="outlined"
                  prepend-inner-icon="mdi-phone"
                  class="mb-2"
                ></v-text-field>
                <v-text-field
                  v-model="userInfo.email"
                  label="ایمیل"
                  variant="outlined"
                  prepend-inner-icon="mdi-email"
                ></v-text-field>
              </v-card-text>
            </v-card>

            <v-card-actions class="justify-space-between">
              <v-btn
                variant="text"
                @click="step = 1"
              >
                <v-icon start>mdi-arrow-right</v-icon>
                بازگشت
              </v-btn>
              <v-btn
                color="primary"
                variant="elevated"
                :disabled="!isUserInfoValid"
                @click="confirmBooking"
              >
                تأیید و رزرو
                <v-icon end>mdi-check</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-stepper-window-item>

        <!-- Step 3: Success -->
        <v-stepper-window-item value="3">
          <v-card elevation="0" class="pa-6 text-center">
            <v-icon
              color="success"
              size="80"
              class="mb-4"
            >
              mdi-check-circle
            </v-icon>
            <v-card-title class="text-h4 mb-4">
              رزرو با موفقیت انجام شد!
            </v-card-title>
            <v-card-text>
              <v-card class="mb-4" elevation="1">
                <v-card-title>جزئیات نوبت</v-card-title>
                <v-card-text>
                  <div class="mb-2">
                    <strong>کد رزرو:</strong> {{ bookingId }}
                  </div>
                  <div class="mb-2">
                    <strong>پزشک:</strong> {{ doctor.name }}
                  </div>
                  <div class="mb-2">
                    <strong>تاریخ:</strong> {{ formatDate(selectedDate) }}
                  </div>
                  <div>
                    <strong>زمان:</strong> {{ selectedTime }}
                  </div>
                </v-card-text>
              </v-card>
              <v-alert type="success" class="mb-4">
                لطفاً 15 دقیقه قبل از زمان نوبت در مطب حضور داشته باشید.
              </v-alert>
            </v-card-text>
            <v-card-actions class="justify-center">
              <v-btn
                color="primary"
                variant="elevated"
                @click="goToProfile"
              >
                مشاهده پروفایل
              </v-btn>
              <v-btn
                variant="outlined"
                @click="goToHome"
              >
                بازگشت به صفحه اصلی
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-stepper-window-item>
      </v-stepper-window>
    </v-stepper>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { gsap } from 'gsap'

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
    this.animatePage()
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
        gsap.from('.v-icon', {
          scale: 0,
          duration: 0.5,
          ease: 'back.out(1.7)'
        })
      } catch (error) {
        console.error('Error booking appointment:', error)
      }
    },
    goToProfile() {
      this.$router.push({ name: 'Profile' })
    },
    goToHome() {
      this.$router.push({ name: 'Home' })
    },
    animatePage() {
      gsap.from('.v-card', {
        opacity: 0,
        y: 30,
        duration: 0.5,
        ease: 'power2.out'
      })
    }
  }
}
</script>

<style scoped>
.booking-stepper {
  max-width: 100%;
}

.time-chip {
  cursor: pointer;
  transition: all 0.3s ease;
}

.time-chip:hover {
  transform: scale(1.05);
}

.gap-2 {
  gap: 8px;
}
</style>

