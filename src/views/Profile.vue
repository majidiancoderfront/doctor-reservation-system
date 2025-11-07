<template>
  <div class="profile-page">
    <v-container class="py-6" style="max-width: 1200px">
      <!-- Header with Icon -->
      <div class="text-center mb-8">
        <v-avatar size="120" color="primary" class="mb-4 profile-avatar">
          <v-icon size="64" color="white">mdi-account-circle</v-icon>
        </v-avatar>
        <h1 class="text-h4 font-weight-bold mb-2">
          <v-icon size="32" class="mr-2">mdi-account</v-icon>
          پروفایل کاربر
        </h1>
        <p class="text-body-2 text-medium-emphasis">
          <v-icon size="16" class="mr-1">mdi-information</v-icon>
          مدیریت اطلاعات شخصی و تاریخچه نوبت‌ها
        </p>
      </div>

      <v-row>
        <!-- User Info -->
        <v-col cols="12" md="4">
          <v-card class="clean-card mb-4" elevation="2">
            <v-card-title class="pa-4">
              <v-icon color="primary" size="24" class="mr-2">mdi-account-circle</v-icon>
              <span class="text-h6 font-weight-bold">اطلاعات کاربری</span>
            </v-card-title>
            <v-card-text class="pa-4">
              <v-text-field
                v-model="userInfo.name"
                label="نام و نام خانوادگی"
                variant="outlined"
                prepend-inner-icon="mdi-account"
                class="mb-3"
                :readonly="!editMode"
                density="comfortable"
              ></v-text-field>
              <v-text-field
                v-model="userInfo.email"
                label="ایمیل"
                variant="outlined"
                prepend-inner-icon="mdi-email"
                class="mb-3"
                :readonly="!editMode"
                density="comfortable"
              ></v-text-field>
              <v-text-field
                v-model="userInfo.phone"
                label="شماره تماس"
                variant="outlined"
                prepend-inner-icon="mdi-phone"
                :readonly="!editMode"
                density="comfortable"
              ></v-text-field>
            </v-card-text>
            <v-card-actions class="pa-4 pt-0">
              <v-btn
                v-if="!editMode"
                color="primary"
                variant="elevated"
                @click="editMode = true"
                block
                class="clean-btn"
                size="large"
              >
                <v-icon start>mdi-pencil</v-icon>
                ویرایش اطلاعات
              </v-btn>
              <div v-else class="d-flex gap-2" style="width: 100%">
                <v-btn
                  color="success"
                  variant="elevated"
                  @click="saveUserInfo"
                  block
                  class="clean-btn"
                  size="large"
                >
                  <v-icon start>mdi-content-save</v-icon>
                  ذخیره
                </v-btn>
                <v-btn
                  color="error"
                  variant="outlined"
                  @click="cancelEdit"
                  block
                  size="large"
                >
                  <v-icon start>mdi-close</v-icon>
                  انصراف
                </v-btn>
              </div>
            </v-card-actions>
          </v-card>

          <!-- Stats with Icons -->
          <v-card class="clean-card" elevation="2">
            <v-card-title class="pa-4">
              <v-icon color="primary" class="mr-2">mdi-chart-box</v-icon>
              <span class="text-h6 font-weight-bold">آمار</span>
            </v-card-title>
            <v-card-text class="pa-4">
              <div class="text-center mb-4">
                <div class="stat-icon-wrapper mb-2">
                  <v-icon size="40" color="primary">mdi-calendar-check</v-icon>
                </div>
                <div class="text-h4 font-weight-bold mb-1">{{ appointments.length }}</div>
                <div class="text-caption text-medium-emphasis">
                  <v-icon size="14" class="mr-1">mdi-calendar</v-icon>
                  نوبت رزرو شده
                </div>
              </div>
              <v-divider class="my-4"></v-divider>
              <div class="text-center">
                <div class="stat-icon-wrapper mb-2">
                  <v-icon size="40" color="success">mdi-check-circle</v-icon>
                </div>
                <div class="text-h4 font-weight-bold mb-1">{{ confirmedAppointments }}</div>
                <div class="text-caption text-medium-emphasis">
                  <v-icon size="14" class="mr-1">mdi-check</v-icon>
                  نوبت تأیید شده
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Appointments -->
        <v-col cols="12" md="8">
          <v-card class="clean-card" elevation="2">
            <v-card-title class="pa-4">
              <v-icon color="primary" size="24" class="mr-2">mdi-calendar-clock</v-icon>
              <span class="text-h6 font-weight-bold">تاریخچه نوبت‌ها</span>
            </v-card-title>
            <v-card-text class="pa-4">
              <div v-if="appointments.length > 0">
                <v-card
                  v-for="appointment in appointments"
                  :key="appointment.id"
                  class="appointment-card mb-3"
                  elevation="0"
                  variant="outlined"
                >
                  <v-card-text class="pa-4">
                    <div class="d-flex align-start">
                      <v-avatar color="primary" size="56" class="mr-3">
                        <v-icon color="white" size="28">mdi-calendar</v-icon>
                      </v-avatar>
                      <div class="flex-grow-1">
                        <div class="d-flex align-center justify-space-between mb-2">
                          <div class="d-flex align-center">
                            <v-icon size="20" color="primary" class="mr-2">mdi-doctor</v-icon>
                            <h3 class="text-h6 font-weight-bold mb-0">
                              {{ appointment.doctorName }}
                            </h3>
                          </div>
                          <v-chip
                            :color="getStatusColor(appointment.status)"
                            size="small"
                            variant="flat"
                          >
                            <v-icon start size="14">{{ getStatusIcon(appointment.status) }}</v-icon>
                            {{ getStatusText(appointment.status) }}
                          </v-chip>
                        </div>
                        <div class="d-flex flex-wrap align-center gap-2 mb-2">
                          <v-chip size="small" color="secondary" variant="flat">
                            <v-icon start size="14">mdi-medical-bag</v-icon>
                            {{ appointment.doctorSpecialty }}
                          </v-chip>
                          <span class="text-body-2">
                            <v-icon size="14" color="primary" class="mr-1">mdi-calendar</v-icon>
                            {{ formatDate(appointment.date) }}
                          </span>
                          <span class="text-body-2">
                            <v-icon size="14" color="primary" class="mr-1">mdi-clock</v-icon>
                            {{ appointment.time }}
                          </span>
                        </div>
                        <div class="text-caption text-medium-emphasis">
                          <v-icon size="12" class="mr-1">mdi-barcode</v-icon>
                          کد رزرو: {{ appointment.id }}
                        </div>
                      </div>
                    </div>
                  </v-card-text>
                </v-card>
              </div>
              <v-alert
                v-else
                type="info"
                variant="tonal"
                class="text-center"
                border="start"
              >
                <v-icon size="48" class="mb-2">mdi-calendar-question</v-icon>
                <div class="text-h6 mb-2">هنوز نوبتی رزرو نکرده‌اید</div>
                <p class="text-body-2 mb-3">
                  برای رزرو نوبت، به صفحه اصلی بروید و پزشک مورد نظر خود را انتخاب کنید.
                </p>
                <v-btn
                  color="primary"
                  variant="elevated"
                  @click="$router.push({ name: 'Home' })"
                  class="clean-btn"
                  size="large"
                >
                  <v-icon start>mdi-home</v-icon>
                  بازگشت به صفحه اصلی
                </v-btn>
              </v-alert>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex'

export default {
  name: 'Profile',
  data() {
    return {
      editMode: false,
      userInfo: {
        name: '',
        email: '',
        phone: ''
      },
      originalUserInfo: {}
    }
  },
  computed: {
    ...mapState(['user']),
    ...mapGetters(['getUserAppointments']),
    appointments() {
      return this.getUserAppointments.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt)
      })
    },
    confirmedAppointments() {
      return this.appointments.filter(apt => apt.status === 'confirmed').length
    }
  },
  mounted() {
    if (this.user) {
      this.userInfo = {
        name: this.user.name || '',
        email: this.user.email || '',
        phone: this.user.phone || ''
      }
      this.originalUserInfo = { ...this.userInfo }
    }
  },
  methods: {
    ...mapMutations(['setUser']),
    formatDate(dateString) {
      const date = new Date(dateString)
      const options = { year: 'numeric', month: 'long', day: 'numeric' }
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
    getStatusIcon(status) {
      const icons = {
        confirmed: 'mdi-check-circle',
        pending: 'mdi-clock-outline',
        cancelled: 'mdi-close-circle',
        completed: 'mdi-check-all'
      }
      return icons[status] || 'mdi-help-circle'
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
    saveUserInfo() {
      this.setUser({
        ...this.user,
        ...this.userInfo
      })
      this.originalUserInfo = { ...this.userInfo }
      this.editMode = false
    },
    cancelEdit() {
      this.userInfo = { ...this.originalUserInfo }
      this.editMode = false
    }
  }
}
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
}

.profile-avatar {
  box-shadow: 0 4px 12px rgba(25, 118, 210, 0.3);
}

.appointment-card {
  cursor: pointer;
  transition: all 0.2s ease;
}

.appointment-card:hover {
  border-color: #1976D2;
  background: rgba(25, 118, 210, 0.02);
}

.v-theme--dark .appointment-card:hover {
  background: rgba(33, 150, 243, 0.1);
}

.stat-icon-wrapper {
  display: inline-block;
  padding: 12px;
  border-radius: 50%;
  background: rgba(25, 118, 210, 0.1);
}

.v-theme--dark .stat-icon-wrapper {
  background: rgba(33, 150, 243, 0.2);
}

.gap-2 {
  gap: 8px;
}
</style>
