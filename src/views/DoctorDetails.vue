<template>
  <div class="doctor-details-page">
    <v-container v-if="doctor" class="py-6">
      <!-- Back Button with Icon -->
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

      <v-row>
        <!-- Doctor Info Card with Enhanced Icons -->
        <v-col cols="12" md="4">
          <v-card class="clean-card mb-4" elevation="2">
            <v-img
              :src="doctor.image"
              height="400"
              cover
            >
              <template v-slot:placeholder>
                <div class="d-flex align-center justify-center fill-height bg-grey-lighten-4">
                  <v-icon size="80" color="grey-lighten-1">mdi-account-doctor</v-icon>
                </div>
              </template>
            </v-img>
            
            <v-card-title class="text-center pa-4">
              <div class="w-100">
                <div class="d-flex align-center justify-center mb-2">
                  <v-icon size="24" color="primary" class="mr-2">mdi-account-circle</v-icon>
                  <h2 class="text-h5 font-weight-bold">{{ doctor.name }}</h2>
                </div>
                <v-chip color="primary" size="small" variant="flat">
                  <v-icon start size="16">mdi-medical-bag</v-icon>
                  {{ doctor.specialty }}
                </v-chip>
              </div>
            </v-card-title>

            <v-card-text class="pa-4">
              <div class="d-flex align-center justify-center mb-4">
                <v-rating
                  :model-value="doctor.rating"
                  color="amber"
                  density="comfortable"
                  size="small"
                  readonly
                  half-increments
                  class="mr-2"
                ></v-rating>
                <v-icon size="18" color="amber" class="mr-1">mdi-star</v-icon>
                <span class="text-body-1 font-weight-bold">{{ doctor.rating }}</span>
                <v-icon size="16" color="grey" class="mr-2 ml-2">mdi-comment-text</v-icon>
                <span class="text-body-2 text-medium-emphasis">
                  ({{ doctor.reviews.length }} نظر)
                </span>
              </div>

              <v-divider class="my-4"></v-divider>

              <div class="contact-info">
                <div class="contact-item mb-3">
                  <v-icon color="primary" size="20" class="mr-3">mdi-phone</v-icon>
                  <span class="text-body-2">{{ doctor.phone }}</span>
                </div>
                <div class="contact-item mb-3">
                  <v-icon color="primary" size="20" class="mr-3">mdi-email</v-icon>
                  <span class="text-body-2">{{ doctor.email }}</span>
                </div>
                <div class="contact-item mb-3">
                  <v-icon color="primary" size="20" class="mr-3 mt-1">mdi-map-marker</v-icon>
                  <span class="text-body-2">{{ doctor.address }}</span>
                </div>
                <div class="contact-item">
                  <v-icon color="primary" size="20" class="mr-3">mdi-briefcase</v-icon>
                  <span class="text-body-2 font-weight-bold">{{ doctor.experience }}</span>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Main Content -->
        <v-col cols="12" md="8">
          <!-- Available Times with Enhanced Icons -->
          <v-card class="clean-card mb-4" elevation="2">
            <v-card-title class="pa-4">
              <v-icon color="primary" size="24" class="mr-2">mdi-clock-outline</v-icon>
              <span class="text-h6 font-weight-bold">زمان‌های در دسترس</span>
            </v-card-title>
            <v-card-text class="pa-4">
              <v-tabs
                v-model="selectedDateTab"
                color="primary"
                class="mb-4"
              >
                <v-tab
                  v-for="(slot, index) in doctor.availableSlots"
                  :key="index"
                  :value="index"
                >
                  <v-icon size="18" class="mr-1">mdi-calendar</v-icon>
                  {{ formatDate(slot.date) }}
                </v-tab>
              </v-tabs>

              <v-window v-model="selectedDateTab">
                <v-window-item
                  v-for="(slot, index) in doctor.availableSlots"
                  :key="index"
                  :value="index"
                >
                  <div class="d-flex flex-wrap gap-2">
                    <v-chip
                      v-for="time in slot.times"
                      :key="time"
                      :class="['time-chip', { selected: selectedTime === time && selectedDateIndex === index }]"
                      @click="selectTime(index, time)"
                    >
                      <v-icon start size="18">mdi-clock</v-icon>
                      {{ time }}
                    </v-chip>
                  </div>
                </v-window-item>
              </v-window>
            </v-card-text>
          </v-card>

          <!-- Reviews with Enhanced Icons -->
          <v-card class="clean-card mb-4" elevation="2">
            <v-card-title class="pa-4">
              <v-icon color="primary" size="24" class="mr-2">mdi-comment-text-multiple</v-icon>
              <span class="text-h6 font-weight-bold">نظرات کاربران</span>
            </v-card-title>
            <v-card-text class="pa-4">
              <div
                v-for="review in doctor.reviews"
                :key="review.id"
                class="review-item mb-4 pb-4"
                :class="{ 'mb-0': review === doctor.reviews[doctor.reviews.length - 1] }"
              >
                <div class="d-flex align-start">
                  <v-avatar
                    color="primary"
                    size="48"
                    class="mr-3"
                  >
                    <v-icon color="white" size="24">mdi-account</v-icon>
                  </v-avatar>
                  <div class="flex-grow-1">
                    <div class="d-flex align-center mb-2">
                      <v-icon size="18" color="primary" class="mr-2">mdi-account-circle</v-icon>
                      <span class="text-body-1 font-weight-bold mr-2">{{ review.user }}</span>
                      <v-rating
                        :model-value="review.rating"
                        color="amber"
                        density="compact"
                        size="small"
                        readonly
                      ></v-rating>
                    </div>
                    <div class="d-flex align-start">
                      <v-icon size="16" color="grey" class="mr-2 mt-1">mdi-format-quote-close</v-icon>
                      <p class="text-body-2 mb-0">{{ review.comment }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </v-card-text>
          </v-card>

          <!-- Booking Button with Icon -->
          <v-btn
            color="primary"
            size="x-large"
            variant="elevated"
            :disabled="!selectedTime"
            @click="goToBooking"
            block
            class="clean-btn booking-btn"
            elevation="4"
          >
            <v-icon start size="28">mdi-calendar-check</v-icon>
            <span class="text-h6 font-weight-bold">رزرو وقت</span>
            <v-icon end size="24">mdi-arrow-left</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-container>

    <v-container v-else class="text-center py-12">
      <v-progress-circular
        indeterminate
        color="primary"
        size="64"
      ></v-progress-circular>
      <p class="mt-4 text-body-1">
        <v-icon size="20" class="mr-1">mdi-loading</v-icon>
        در حال بارگذاری...
      </p>
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

.contact-item {
  display: flex;
  align-items: flex-start;
}

.review-item {
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}

.v-theme--dark .review-item {
  border-bottom-color: rgba(255, 255, 255, 0.12);
}

.review-item:last-child {
  border-bottom: none;
}

.booking-btn {
  height: 56px;
}

.gap-2 {
  gap: 8px;
}
</style>
