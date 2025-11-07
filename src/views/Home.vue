<template>
  <div class="home-page">
    <!-- Hero Section with Icons -->
    <div class="hero-section">
      <v-container>
        <div class="text-center">
          <div class="hero-icon mb-4">
            <v-icon size="80" color="white">mdi-hospital-building</v-icon>
          </div>
          <h1 class="text-h3 text-md-h2 font-weight-bold mb-3">
            <v-icon size="32" class="mr-2">mdi-doctor</v-icon>
            سیستم رزرو وقت دکتر
          </h1>
          <p class="text-h6 mb-6" style="opacity: 0.9;">
            <v-icon size="20" class="mr-1">mdi-calendar-clock</v-icon>
            انتخاب پزشک و رزرو نوبت به صورت آنلاین
          </p>
          
          <!-- Search and Filter Section -->
          <v-card class="search-filter-card mx-auto" style="max-width: 800px;" elevation="4">
            <v-card-text class="pa-4">
              <v-row>
                <v-col cols="12" md="8">
                  <v-text-field
                    v-model="searchQuery"
                    prepend-inner-icon="mdi-magnify"
                    label="جستجوی پزشک (نام یا تخصص)"
                    variant="outlined"
                    hide-details
                    clearable
                    density="comfortable"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="4">
                  <v-select
                    v-model="selectedSpecialty"
                    :items="specialties"
                    prepend-inner-icon="mdi-filter"
                    label="فیلتر بر اساس تخصص"
                    variant="outlined"
                    hide-details
                    clearable
                    density="comfortable"
                  ></v-select>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </div>
      </v-container>
    </div>

    <v-container class="py-8">
      <!-- Empty State with Icon -->
      <div v-if="filteredDoctorsList.length === 0" class="text-center py-12">
        <v-icon size="100" color="grey-lighten-1" class="mb-4">mdi-doctor-off</v-icon>
        <h2 class="text-h5 mb-2">
          <v-icon size="24" class="mr-2">mdi-alert-circle</v-icon>
          پزشکی یافت نشد
        </h2>
        <p class="text-body-2 text-medium-emphasis">
          لطفاً کلمه جستجوی دیگری را امتحان کنید
        </p>
      </div>

      <!-- Doctors Grid with Enhanced Cards -->
      <v-row v-else class="mt-4">
        <v-col
          v-for="doctor in filteredDoctorsList"
          :key="doctor.id"
          cols="12"
          sm="6"
          md="4"
          lg="3"
        >
          <v-card
            class="doctor-card h-100"
            elevation="2"
            @click="goToDoctorDetails(doctor.id)"
          >
            <!-- Doctor Image with Rating Badge -->
            <div class="doctor-image">
              <v-img
                :src="doctor.image"
                height="240"
                cover
              >
                <template v-slot:placeholder>
                  <div class="d-flex align-center justify-center fill-height bg-grey-lighten-4">
                    <v-icon size="64" color="grey-lighten-1">mdi-account-doctor</v-icon>
                  </div>
                </template>
                
                <!-- Rating Badge with Icon -->
                <div class="pa-3" style="position: absolute; top: 0; left: 0; right: 0;">
                  <div class="rating-badge">
                    <v-icon size="16" color="white">mdi-star</v-icon>
                    <span class="ml-1">{{ doctor.rating }}</span>
                  </div>
                </div>
              </v-img>
            </div>

            <!-- Card Content -->
            <v-card-title class="pa-4 pb-2">
              <div class="d-flex align-center">
                <v-icon size="20" color="primary" class="mr-2">mdi-account-circle</v-icon>
                <span class="text-h6 font-weight-bold">{{ doctor.name }}</span>
              </div>
            </v-card-title>

            <v-card-subtitle class="pa-2 pb-3">
              <v-chip
                color="primary"
                size="small"
                variant="flat"
              >
                <v-icon start size="16">mdi-medical-bag</v-icon>
                {{ doctor.specialty }}
              </v-chip>
            </v-card-subtitle>

            <v-card-text class="pa-4 pt-0">
              <div class="d-flex align-center justify-space-between mb-3">
                <div class="d-flex align-center">
                  <v-rating
                    :model-value="doctor.rating"
                    color="amber"
                    density="compact"
                    size="small"
                    readonly
                    half-increments
                  ></v-rating>
                  <v-icon size="14" color="grey" class="mr-1 ml-2">mdi-comment-text</v-icon>
                  <span class="text-caption">
                    ({{ doctor.reviews.length }})
                  </span>
                </div>
              </div>
              
              <div class="d-flex align-center text-caption text-medium-emphasis mb-2">
                <v-icon size="16" color="primary" class="mr-1">mdi-briefcase</v-icon>
                <span>{{ doctor.experience }}</span>
              </div>

              <div class="d-flex align-center text-caption text-medium-emphasis">
                <v-icon size="16" color="success" class="mr-1">mdi-check-circle</v-icon>
                <span>در دسترس</span>
              </div>
            </v-card-text>

            <v-card-actions class="pa-4 pt-0">
              <v-btn
                color="primary"
                variant="elevated"
                block
                class="clean-btn"
                @click.stop="goToDoctorDetails(doctor.id)"
              >
                <v-icon start size="20">mdi-eye</v-icon>
                مشاهده جزئیات
                <v-icon end size="20">mdi-arrow-left</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>

      <!-- Stats Section with Icons -->
      <v-row class="mt-12">
        <v-col cols="12" md="4">
          <v-card class="clean-card text-center pa-6 stats-card" elevation="2">
            <div class="stats-icon-wrapper mb-3">
              <v-icon size="48" color="primary">mdi-doctor</v-icon>
            </div>
            <h3 class="text-h4 font-weight-bold mb-1">{{ filteredDoctorsList.length }}</h3>
            <p class="text-body-2 text-medium-emphasis">
              <v-icon size="16" class="mr-1">mdi-account-group</v-icon>
              پزشک متخصص
            </p>
          </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <v-card class="clean-card text-center pa-6 stats-card" elevation="2">
            <div class="stats-icon-wrapper mb-3">
              <v-icon size="48" color="success">mdi-calendar-check</v-icon>
            </div>
            <h3 class="text-h4 font-weight-bold mb-1">24/7</h3>
            <p class="text-body-2 text-medium-emphasis">
              <v-icon size="16" class="mr-1">mdi-clock-outline</v-icon>
              پشتیبانی آنلاین
            </p>
          </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <v-card class="clean-card text-center pa-6 stats-card" elevation="2">
            <div class="stats-icon-wrapper mb-3">
              <v-icon size="48" color="info">mdi-account-group</v-icon>
            </div>
            <h3 class="text-h4 font-weight-bold mb-1">100%</h3>
            <p class="text-body-2 text-medium-emphasis">
              <v-icon size="16" class="mr-1">mdi-star</v-icon>
              رضایت کاربران
            </p>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Home',
  data() {
    return {
      searchQuery: '',
      selectedSpecialty: null,
      specialties: [
        'قلب و عروق',
        'پزشک عمومی',
        'ارتوپدی',
        'پزشک اطفال'
      ]
    }
  },
  computed: {
    ...mapGetters(['filteredDoctors']),
    filteredDoctorsList() {
      let doctors = this.filteredDoctors(this.searchQuery)
      if (this.selectedSpecialty) {
        doctors = doctors.filter(doctor => doctor.specialty === this.selectedSpecialty)
      }
      return doctors
    }
  },
  methods: {
    goToDoctorDetails(doctorId) {
      this.$router.push({ name: 'DoctorDetails', params: { id: doctorId } })
    }
  }
}
</script>

<style scoped>
.home-page {
  min-height: 100vh;
}

.hero-icon {
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

.search-filter-card {
  border-radius: 16px;
}

.stats-card {
  transition: all 0.3s ease;
}

.stats-card:hover {
  transform: translateY(-4px);
}

.stats-icon-wrapper {
  display: inline-block;
  padding: 16px;
  border-radius: 50%;
  background: rgba(25, 118, 210, 0.1);
}

.v-theme--dark .stats-icon-wrapper {
  background: rgba(33, 150, 243, 0.2);
}
</style>
