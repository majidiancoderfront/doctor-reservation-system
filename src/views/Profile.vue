<template>
  <v-container class="pa-4" style="max-width: 1200px">
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 mb-6">
          <i class="fas fa-user mr-2"></i>
          پروفایل کاربر
        </h1>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="4">
        <v-card elevation="3" class="mb-4">
          <v-card-title class="pa-4">
            <i class="fas fa-user-circle mr-2"></i>
            اطلاعات کاربری
          </v-card-title>
          <v-card-text>
            <v-text-field
              v-model="userInfo.name"
              label="نام و نام خانوادگی"
              variant="outlined"
              prepend-inner-icon="mdi-account"
              class="mb-2"
              :readonly="!editMode"
            ></v-text-field>
            <v-text-field
              v-model="userInfo.email"
              label="ایمیل"
              variant="outlined"
              prepend-inner-icon="mdi-email"
              class="mb-2"
              :readonly="!editMode"
            ></v-text-field>
            <v-text-field
              v-model="userInfo.phone"
              label="شماره تماس"
              variant="outlined"
              prepend-inner-icon="mdi-phone"
              :readonly="!editMode"
            ></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-btn
              v-if="!editMode"
              color="primary"
              variant="elevated"
              @click="editMode = true"
              block
            >
              <i class="fas fa-edit mr-2"></i>
              ویرایش اطلاعات
            </v-btn>
            <div v-else class="d-flex gap-2" style="width: 100%">
              <v-btn
                color="success"
                variant="elevated"
                @click="saveUserInfo"
                block
              >
                <i class="fas fa-save mr-2"></i>
                ذخیره
              </v-btn>
              <v-btn
                color="error"
                variant="outlined"
                @click="cancelEdit"
                block
              >
                انصراف
              </v-btn>
            </div>
          </v-card-actions>
        </v-card>
      </v-col>

      <v-col cols="12" md="8">
        <v-card elevation="3">
          <v-card-title class="pa-4">
            <i class="fas fa-calendar-check mr-2"></i>
            تاریخچه نوبت‌ها
          </v-card-title>
          <v-card-text>
            <v-list v-if="appointments.length > 0">
              <v-list-item
                v-for="appointment in appointments"
                :key="appointment.id"
                class="mb-2"
                elevation="1"
              >
                <template v-slot:prepend>
                  <v-avatar color="primary">
                    <i class="fas fa-calendar"></i>
                  </v-avatar>
                </template>
                <v-list-item-title>
                  {{ appointment.doctorName }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  <v-chip size="small" color="secondary" class="mr-2">
                    {{ appointment.doctorSpecialty }}
                  </v-chip>
                  <span class="mr-2">
                    <i class="fas fa-calendar mr-1"></i>
                    {{ formatDate(appointment.date) }}
                  </span>
                  <span>
                    <i class="fas fa-clock mr-1"></i>
                    {{ appointment.time }}
                  </span>
                </v-list-item-subtitle>
                <template v-slot:append>
                  <v-chip
                    :color="getStatusColor(appointment.status)"
                    size="small"
                  >
                    {{ getStatusText(appointment.status) }}
                  </v-chip>
                </template>
              </v-list-item>
            </v-list>
            <v-alert
              v-else
              type="info"
              class="text-center"
            >
              <i class="fas fa-info-circle mr-2"></i>
              هنوز نوبتی رزرو نکرده‌اید
            </v-alert>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex'
import { gsap } from 'gsap'

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
    this.animatePage()
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
      this.$toast?.success('اطلاعات با موفقیت ذخیره شد')
    },
    cancelEdit() {
      this.userInfo = { ...this.originalUserInfo }
      this.editMode = false
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
.gap-2 {
  gap: 8px;
}

.v-list-item {
  border-radius: 8px;
  margin-bottom: 8px;
}
</style>

