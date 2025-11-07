<template>
  <div class="doctor-details-page">
    <v-container v-if="doctor" class="py-6">
      <v-btn icon variant="text" @click="$router.back()" class="mb-4">
        <v-icon>mdi-arrow-right</v-icon>
      </v-btn>

      <v-row>
        <v-col cols="12" md="4">
          <v-card elevation="2" class="mb-4">
            <v-img :src="doctor.image" height="300" cover>
              <template v-slot:placeholder>
                <div class="d-flex align-center justify-center fill-height bg-grey-lighten-4">
                  <v-icon size="64" color="grey">mdi-account-doctor</v-icon>
                </div>
              </template>
            </v-img>
            
            <v-card-title class="text-center pa-4">
              <h2 class="text-h6 font-weight-bold mb-2">{{ doctor.name }}</h2>
              <v-chip color="primary" size="small" variant="flat">
                {{ doctor.specialty }}
              </v-chip>
            </v-card-title>

            <v-card-text class="pa-4">
              <div class="d-flex align-center justify-center mb-4">
                <v-rating :model-value="doctor.rating" color="amber" density="compact" size="small" readonly half-increments class="ml-2"></v-rating>
                <span class="text-body-1 font-weight-bold">{{ doctor.rating }}</span>
                <span class="text-body-2 mr-2 text-medium-emphasis">({{ doctor.reviews.length }} نظر)</span>
              </div>

              <v-divider class="my-4"></v-divider>

              <div>
                <div class="d-flex align-center mb-3">
                  <v-icon color="primary" class="ml-3">mdi-phone</v-icon>
                  <span>{{ doctor.phone }}</span>
                </div>
                <div class="d-flex align-center mb-3">
                  <v-icon color="primary" class="ml-3">mdi-email</v-icon>
                  <span>{{ doctor.email }}</span>
                </div>
                <div class="d-flex align-start mb-3">
                  <v-icon color="primary" class="ml-3 mt-1">mdi-map-marker</v-icon>
                  <span>{{ doctor.address }}</span>
                </div>
                <div class="d-flex align-center">
                  <v-icon color="primary" class="ml-3">mdi-briefcase</v-icon>
                  <span class="font-weight-bold">{{ doctor.experience }}</span>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="8">
          <v-card elevation="2" class="mb-4">
            <v-card-title class="pa-4">
              <v-icon color="primary" class="ml-2">mdi-clock-outline</v-icon>
              زمان‌های در دسترس
            </v-card-title>
            <v-card-text class="pa-4">
              <v-tabs v-model="selectedDateTab" color="primary" class="mb-4">
                <v-tab v-for="(slot, index) in doctor.availableSlots" :key="index" :value="index">
                  {{ formatDate(slot.date) }}
                </v-tab>
              </v-tabs>

              <v-window v-model="selectedDateTab">
                <v-window-item v-for="(slot, index) in doctor.availableSlots" :key="index" :value="index">
                  <div class="d-flex flex-wrap" style="gap: 8px;">
                    <v-chip
                      v-for="time in slot.times"
                      :key="time"
                      :color="selectedTime === time && selectedDateIndex === index ? 'primary' : 'default'"
                      @click="selectTime(index, time)"
                      style="cursor: pointer;"
                    >
                      {{ time }}
                    </v-chip>
                  </div>
                </v-window-item>
              </v-window>
            </v-card-text>
          </v-card>

          <v-card elevation="2" class="mb-4">
            <v-card-title class="pa-4">
              <v-icon color="primary" class="ml-2">mdi-comment-text</v-icon>
              نظرات کاربران
            </v-card-title>
            <v-card-text class="pa-4">
              <div v-for="review in doctor.reviews" :key="review.id" class="mb-4 pb-4" style="border-bottom: 1px solid rgba(0,0,0,0.12);">
                <div class="d-flex align-start">
                  <v-avatar color="primary" size="40" class="ml-3">
                    <span class="text-white">{{ review.user.charAt(0) }}</span>
                  </v-avatar>
                  <div class="flex-grow-1">
                    <div class="d-flex align-center mb-1">
                      <span class="font-weight-bold mr-2">{{ review.user }}</span>
                      <v-rating :model-value="review.rating" color="amber" density="compact" size="small" readonly></v-rating>
                    </div>
                    <p class="text-body-2 mb-0">{{ review.comment }}</p>
                  </div>
                </div>
              </div>
            </v-card-text>
          </v-card>

          <v-btn
            color="primary"
            variant="elevated"
            size="large"
            :disabled="!selectedTime"
            @click="goToBooking"
            block
          >
            <v-icon start>mdi-calendar-check</v-icon>
            رزرو وقت
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'DoctorDetails',
  props: {
    id: {
      type: [String, Number],
      required: true
    }
  },
  data() {
    return {
      selectedDateTab: 0,
      selectedTime: null,
      selectedDateIndex: null
    }
  },
  computed: {
    ...mapGetters(['getDoctorById']),
    doctor() {
      return this.getDoctorById(this.id)
    }
  },
  methods: {
    formatDate(dateString) {
      const date = new Date(dateString)
      const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' }
      return date.toLocaleDateString('fa-IR', options)
    },
    selectTime(dateIndex, time) {
      this.selectedTime = time
      this.selectedDateIndex = dateIndex
    },
    goToBooking() {
      if (!this.$store.state.user) {
        this.$router.push({ name: 'Login', query: { redirect: this.$route.fullPath } })
        return
      }
      
      const selectedSlot = this.doctor.availableSlots[this.selectedDateIndex]
      this.$router.push({
        name: 'Booking',
        params: { doctorId: this.id },
        query: {
          date: selectedSlot.date,
          time: this.selectedTime
        }
      })
    }
  }
}
</script>

<style scoped>
.doctor-details-page {
  min-height: 100vh;
}
</style>
