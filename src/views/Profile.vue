<template>
  <div class="profile-page">
    <v-container class="py-6" style="max-width: 1200px">
      <div class="text-center mb-8">
        <v-avatar size="100" color="primary" class="mb-4">
          <v-icon size="48" color="white">mdi-account</v-icon>
        </v-avatar>
        <h1 class="text-h4 font-weight-bold mb-2">پروفایل کاربر</h1>
      </div>

      <v-row>
        <v-col cols="12" md="4">
          <v-card elevation="2" class="mb-4">
            <v-card-title class="pa-4">
              <v-icon color="primary" class="ml-2">mdi-account-circle</v-icon>
              اطلاعات کاربری
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
              >
                <v-icon start>mdi-pencil</v-icon>
                ویرایش اطلاعات
              </v-btn>
              <div v-else class="d-flex" style="gap: 8px; width: 100%;">
                <v-btn color="success" variant="elevated" @click="saveUserInfo" block>
                  <v-icon start>mdi-content-save</v-icon>
                  ذخیره
                </v-btn>
                <v-btn color="error" variant="outlined" @click="cancelEdit" block>
                  انصراف
                </v-btn>
              </div>
            </v-card-actions>
          </v-card>

          <v-card elevation="2">
            <v-card-title class="pa-4">آمار</v-card-title>
            <v-card-text class="pa-4">
              <div class="text-center mb-4">
                <v-icon size="40" color="primary" class="mb-2">mdi-calendar-check</v-icon>
                <div class="text-h4 font-weight-bold mb-1">{{ appointments.length }}</div>
                <div class="text-caption text-medium-emphasis">نوبت رزرو شده</div>
              </div>
              <v-divider class="my-4"></v-divider>
              <div class="text-center">
                <v-icon size="40" color="success" class="mb-2">mdi-check-circle</v-icon>
                <div class="text-h4 font-weight-bold mb-1">{{ confirmedAppointments }}</div>
                <div class="text-caption text-medium-emphasis">نوبت تأیید شده</div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="8">
          <v-card elevation="2">
            <v-card-title class="pa-4">
              <v-icon color="primary" class="ml-2">mdi-calendar-clock</v-icon>
              تاریخچه نوبت‌ها
            </v-card-title>
            <v-card-text class="pa-4">
              <div v-if="appointments.length > 0">
                <v-card
                  v-for="appointment in appointments"
                  :key="appointment.id"
                  variant="outlined"
                  class="mb-3"
                >
                  <v-card-text class="pa-4">
                    <div class="d-flex align-start">
                      <v-avatar color="primary" size="48" class="ml-3">
                        <v-icon color="white">mdi-calendar</v-icon>
                      </v-avatar>
                      <div class="flex-grow-1">
                        <div class="d-flex align-center justify-space-between mb-2">
                          <h3 class="text-h6 font-weight-bold mb-0">{{ appointment.doctorName }}</h3>
                          <v-chip :color="getStatusColor(appointment.status)" size="small" variant="flat">
                            {{ getStatusText(appointment.status) }}
                          </v-chip>
                        </div>
                        <div class="d-flex flex-wrap align-center mb-2" style="gap: 8px;">
                          <v-chip size="small" color="secondary" variant="flat">
                            {{ appointment.doctorSpecialty }}
                          </v-chip>
                          <span class="text-body-2">
                            <v-icon size="14" class="ml-1">mdi-calendar</v-icon>
                            {{ formatDate(appointment.date) }}
                          </span>
                          <span class="text-body-2">
                            <v-icon size="14" class="ml-1">mdi-clock</v-icon>
                            {{ appointment.time }}
                          </span>
                        </div>
                        <div class="text-caption text-medium-emphasis">
                          کد رزرو: {{ appointment.id }}
                        </div>
                      </div>
                    </div>
                  </v-card-text>
                </v-card>
              </div>
              <v-alert v-else type="info" variant="tonal" class="text-center">
                <v-icon size="48" class="mb-2">mdi-calendar-question</v-icon>
                <div class="text-h6 mb-2">هنوز نوبتی رزرو نکرده‌اید</div>
                <v-btn color="primary" variant="elevated" @click="$router.push({ name: 'Home' })">
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
</style>
