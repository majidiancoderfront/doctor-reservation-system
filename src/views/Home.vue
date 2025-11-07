<template>
  <div class="home-page">
    <!-- Hero Section -->
    <div class="hero-section">
      <v-container>
        <div class="text-center text-white">
          <v-icon size="64" class="mb-4">mdi-doctor</v-icon>
          <h1 class="text-h3 text-md-h2 font-weight-bold mb-3">
            سیستم رزرو وقت دکتر
          </h1>
          <p class="text-h6 mb-8">
            انتخاب پزشک و رزرو نوبت به صورت آنلاین
          </p>
          
          <!-- Search -->
          <v-card class="mx-auto" style="max-width: 700px;" elevation="4">
            <v-card-text class="pa-4">
              <v-row>
                <v-col cols="12" md="8">
                  <v-text-field
                    v-model="searchQuery"
                    prepend-inner-icon="mdi-magnify"
                    label="جستجوی پزشک"
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
                    label="تخصص"
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

    <!-- Doctors List -->
    <v-container class="py-8">
      <div v-if="filteredDoctorsList.length === 0" class="text-center py-12">
        <v-icon size="80" color="grey" class="mb-4">mdi-doctor-off</v-icon>
        <h2 class="text-h5 mb-2">پزشکی یافت نشد</h2>
        <p class="text-body-2 text-medium-emphasis">
          لطفاً کلمه جستجوی دیگری را امتحان کنید
        </p>
      </div>

      <v-row v-else>
        <v-col
          v-for="doctor in filteredDoctorsList"
          :key="doctor.id"
          cols="12"
          sm="6"
          md="4"
          lg="3"
        >
          <v-card
            class="doctor-card"
            elevation="2"
            @click="goToDoctorDetails(doctor.id)"
          >
            <v-img
              :src="doctor.image"
              height="200"
              cover
            >
              <template v-slot:placeholder>
                <div class="d-flex align-center justify-center fill-height bg-grey-lighten-4">
                  <v-icon size="48" color="grey">mdi-account-doctor</v-icon>
                </div>
              </template>
              
              <div class="pa-2">
                <v-chip color="error" size="small">
                  <v-icon start size="14">mdi-star</v-icon>
                  {{ doctor.rating }}
                </v-chip>
              </div>
            </v-img>

            <v-card-title class="pa-4 pb-2">
              <v-icon size="20" color="primary" class="ml-2">mdi-account-circle</v-icon>
              {{ doctor.name }}
            </v-card-title>

            <v-card-subtitle class="pa-4 pt-0 pb-2">
              <v-chip color="primary" size="small" variant="flat">
                <v-icon start size="14">mdi-medical-bag</v-icon>
                {{ doctor.specialty }}
              </v-chip>
            </v-card-subtitle>

            <v-card-text class="pa-4 pt-0">
              <div class="d-flex align-center mb-2">
                <v-rating
                  :model-value="doctor.rating"
                  color="amber"
                  density="compact"
                  size="small"
                  readonly
                  half-increments
                ></v-rating>
                <span class="text-caption mr-2">({{ doctor.reviews.length }})</span>
              </div>
              <div class="d-flex align-center text-caption text-medium-emphasis">
                <v-icon size="16" color="primary" class="ml-1">mdi-briefcase</v-icon>
                {{ doctor.experience }}
              </div>
            </v-card-text>

            <v-card-actions class="pa-4">
              <v-btn
                color="primary"
                variant="elevated"
                block
                @click.stop="goToDoctorDetails(doctor.id)"
              >
                <v-icon start>mdi-eye</v-icon>
                مشاهده جزئیات
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>

      <!-- Stats -->
      <v-row class="mt-8">
        <v-col cols="12" md="4">
          <v-card class="text-center pa-6" elevation="2">
            <v-icon size="48" color="primary" class="mb-3">mdi-doctor</v-icon>
            <h3 class="text-h4 font-weight-bold mb-1">{{ filteredDoctorsList.length }}</h3>
            <p class="text-body-2 text-medium-emphasis">پزشک متخصص</p>
          </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <v-card class="text-center pa-6" elevation="2">
            <v-icon size="48" color="success" class="mb-3">mdi-calendar-check</v-icon>
            <h3 class="text-h4 font-weight-bold mb-1">24/7</h3>
            <p class="text-body-2 text-medium-emphasis">پشتیبانی آنلاین</p>
          </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <v-card class="text-center pa-6" elevation="2">
            <v-icon size="48" color="info" class="mb-3">mdi-star</v-icon>
            <h3 class="text-h4 font-weight-bold mb-1">100%</h3>
            <p class="text-body-2 text-medium-emphasis">رضایت کاربران</p>
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

.hero-section {
  background: linear-gradient(135deg, #1976D2 0%, #1565C0 100%);
  padding: 80px 20px;
  color: white;
}

.v-theme--dark .hero-section {
  background: linear-gradient(135deg, #1565C0 0%, #0D47A1 100%);
}

.doctor-card {
  transition: all 0.3s ease;
  cursor: pointer;
}

.doctor-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}
</style>
