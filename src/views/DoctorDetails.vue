<template>
  <v-container v-if="doctor" class="pa-4">
    <v-btn
      icon
      @click="$router.back()"
      class="mb-4"
      color="primary"
    >
      <v-icon>mdi-arrow-right</v-icon>
    </v-btn>

    <v-row>
      <v-col cols="12" md="4">
        <v-card elevation="4" class="mb-4">
          <v-img
            :src="doctor.image"
            height="400"
            cover
          ></v-img>
          <v-card-title class="text-center pa-4">
            {{ doctor.name }}
          </v-card-title>
          <v-card-subtitle class="text-center">
            <v-chip color="primary" size="large">
              {{ doctor.specialty }}
            </v-chip>
          </v-card-subtitle>
        </v-card>

        <v-card elevation="2">
          <v-card-title class="pa-4">
            <i class="fas fa-info-circle mr-2"></i>
            اطلاعات تماس
          </v-card-title>
          <v-card-text>
            <div class="mb-3">
              <v-icon class="mr-2">mdi-phone</v-icon>
              <strong>تلفن:</strong> {{ doctor.phone }}
            </div>
            <div class="mb-3">
              <v-icon class="mr-2">mdi-email</v-icon>
              <strong>ایمیل:</strong> {{ doctor.email }}
            </div>
            <div class="mb-3">
              <v-icon class="mr-2">mdi-map-marker</v-icon>
              <strong>آدرس:</strong> {{ doctor.address }}
            </div>
            <div>
              <v-icon class="mr-2">mdi-briefcase</v-icon>
              <strong>سابقه کار:</strong> {{ doctor.experience }}
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="8">
        <v-card elevation="2" class="mb-4">
          <v-card-title class="pa-4">
            <div class="d-flex align-center">
              <v-rating
                :model-value="doctor.rating"
                color="amber"
                density="comfortable"
                size="large"
                readonly
                half-increments
                class="mr-2"
              ></v-rating>
              <span class="text-h6">{{ doctor.rating }}</span>
              <span class="text-body-2 mr-2 text-medium-emphasis">
                ({{ doctor.reviews.length }} نظر)
              </span>
            </div>
          </v-card-title>
        </v-card>

        <v-card elevation="2" class="mb-4">
          <v-card-title class="pa-4">
            <i class="fas fa-clock mr-2"></i>
            زمان‌های در دسترس
          </v-card-title>
          <v-card-text>
            <v-tabs v-model="selectedDateTab" color="primary">
              <v-tab
                v-for="(slot, index) in doctor.availableSlots"
                :key="index"
                :value="index"
              >
                {{ formatDate(slot.date) }}
              </v-tab>
            </v-tabs>

            <v-window v-model="selectedDateTab" class="mt-4">
              <v-window-item
                v-for="(slot, index) in doctor.availableSlots"
                :key="index"
                :value="index"
              >
                <div class="d-flex flex-wrap gap-2">
                  <v-chip
                    v-for="time in slot.times"
                    :key="time"
                    :color="selectedTime === time && selectedDateIndex === index ? 'primary' : 'default'"
                    size="large"
                    @click="selectTime(index, time)"
                    class="time-chip"
                  >
                    {{ time }}
                  </v-chip>
                </div>
              </v-window-item>
            </v-window>
          </v-card-text>
        </v-card>

        <v-card elevation="2">
          <v-card-title class="pa-4">
            <i class="fas fa-comments mr-2"></i>
            نظرات کاربران
          </v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item
                v-for="review in doctor.reviews"
                :key="review.id"
                class="mb-2"
              >
                <template v-slot:prepend>
                  <v-avatar color="primary">
                    {{ review.user.charAt(0) }}
                  </v-avatar>
                </template>
                <v-list-item-title>{{ review.user }}</v-list-item-title>
                <v-list-item-subtitle>
                  <v-rating
                    :model-value="review.rating"
                    color="amber"
                    density="compact"
                    size="small"
                    readonly
                    class="d-inline-block"
                  ></v-rating>
                </v-list-item-subtitle>
                <v-list-item-subtitle class="mt-1">
                  {{ review.comment }}
                </v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>

        <v-card-actions class="justify-center mt-4">
          <v-btn
            color="primary"
            size="large"
            variant="elevated"
            :disabled="!selectedTime"
            @click="goToBooking"
            block
          >
            <i class="fas fa-calendar-check mr-2"></i>
            رزرو وقت
          </v-btn>
        </v-card-actions>
      </v-col>
    </v-row>
  </v-container>

  <v-container v-else class="text-center">
    <v-progress-circular
      indeterminate
      color="primary"
      size="64"
    ></v-progress-circular>
    <p class="mt-4">در حال بارگذاری...</p>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import { gsap } from 'gsap'

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
  mounted() {
    if (this.doctor) {
      this.animatePage()
    }
  },
  watch: {
    doctor() {
      if (this.doctor) {
        this.$nextTick(() => {
          this.animatePage()
        })
      }
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
    },
    animatePage() {
      gsap.from('.v-card', {
        opacity: 0,
        y: 30,
        duration: 0.5,
        stagger: 0.1,
        ease: 'power2.out'
      })
    }
  }
}
</script>

<style scoped>
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

