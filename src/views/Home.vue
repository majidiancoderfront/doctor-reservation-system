<template>
  <v-container fluid class="pa-4">
    <v-row>
      <v-col cols="12">
        <div class="text-center mb-8">
          <h1 class="text-h3 mb-4">
            <i class="fas fa-user-doctor mr-2"></i>
            سیستم رزرو وقت دکتر
          </h1>
          <p class="text-h6 text-medium-emphasis">
            انتخاب پزشک مورد نظر و رزرو نوبت به صورت آنلاین
          </p>
        </div>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="8" offset-md="2">
        <v-card class="pa-4 mb-6" elevation="3">
          <v-text-field
            v-model="searchQuery"
            prepend-inner-icon="mdi-magnify"
            label="جستجوی پزشک (نام یا تخصص)"
            variant="outlined"
            clearable
            hide-details
          ></v-text-field>
        </v-card>
      </v-col>
    </v-row>

    <v-row v-if="filteredDoctorsList.length === 0" class="mt-8">
      <v-col cols="12" class="text-center">
        <v-icon size="64" color="grey">mdi-doctor</v-icon>
        <p class="text-h6 mt-4 text-medium-emphasis">
          پزشکی یافت نشد
        </p>
      </v-col>
    </v-row>

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
          elevation="4"
          hover
          @click="goToDoctorDetails(doctor.id)"
        >
          <v-img
            :src="doctor.image"
            height="250"
            cover
            class="doctor-image"
          >
            <template v-slot:placeholder>
              <div class="d-flex align-center justify-center fill-height">
                <v-progress-circular
                  color="primary"
                  indeterminate
                ></v-progress-circular>
              </div>
            </template>
          </v-img>

          <v-card-title class="text-center pa-4">
            {{ doctor.name }}
          </v-card-title>

          <v-card-subtitle class="text-center">
            <v-chip color="primary" size="small">
              {{ doctor.specialty }}
            </v-chip>
          </v-card-subtitle>

          <v-card-text>
            <div class="d-flex align-center justify-center mb-2">
              <v-rating
                :model-value="doctor.rating"
                color="amber"
                density="compact"
                size="small"
                readonly
                half-increments
              ></v-rating>
              <span class="ml-2 text-caption">
                {{ doctor.rating }} ({{ doctor.reviews.length }} نظر)
              </span>
            </div>
            <div class="text-caption text-medium-emphasis text-center">
              <i class="fas fa-briefcase mr-1"></i>
              {{ doctor.experience }} سابقه کار
            </div>
          </v-card-text>

          <v-card-actions class="justify-center pb-4">
            <v-btn
              color="primary"
              variant="elevated"
              @click.stop="goToDoctorDetails(doctor.id)"
            >
              مشاهده جزئیات
              <v-icon end>mdi-arrow-left</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import { gsap } from 'gsap'

export default {
  name: 'Home',
  data() {
    return {
      searchQuery: ''
    }
  },
  computed: {
    ...mapGetters(['filteredDoctors']),
    filteredDoctorsList() {
      return this.filteredDoctors(this.searchQuery)
    }
  },
  mounted() {
    this.animateCards()
  },
  watch: {
    filteredDoctorsList: {
      handler() {
        this.$nextTick(() => {
          this.animateCards()
        })
      },
      deep: true
    }
  },
  methods: {
    goToDoctorDetails(doctorId) {
      this.$router.push({ name: 'DoctorDetails', params: { id: doctorId } })
    },
    animateCards() {
      gsap.from('.doctor-card', {
        opacity: 0,
        y: 50,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out'
      })
    }
  }
}
</script>

<style scoped>
.doctor-card {
  cursor: pointer;
  transition: transform 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.doctor-card:hover {
  transform: translateY(-8px);
}

.doctor-image {
  border-radius: 4px 4px 0 0;
}

.v-card-title {
  font-weight: 600;
  font-size: 1.1rem;
}

@media (max-width: 600px) {
  .text-h3 {
    font-size: 1.8rem !important;
  }
  
  .text-h6 {
    font-size: 1rem !important;
  }
}
</style>

