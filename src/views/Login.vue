<template>
  <div class="login-page">
    <v-container class="py-6">
      <v-row justify="center" align="center" style="min-height: 80vh">
        <v-col cols="12" sm="10" md="8" lg="6">
          <!-- Login Type Selection -->
          <v-card class="clean-card mb-4" elevation="2">
            <v-card-text class="pa-4">
              <div class="text-center mb-4">
                <h2 class="text-h5 font-weight-bold mb-2">
                  <v-icon size="28" class="mr-2">mdi-login</v-icon>
                  ورود به سیستم
                </h2>
                <p class="text-body-2 text-medium-emphasis">
                  نوع حساب کاربری خود را انتخاب کنید
                </p>
              </div>
              
              <v-btn-toggle
                v-model="loginType"
                mandatory
                variant="outlined"
                divided
                class="w-100 mb-4"
              >
                <v-btn value="user" class="flex-grow-1" size="large">
                  <v-icon start size="24">mdi-account</v-icon>
                  کاربر
                </v-btn>
                <v-btn value="doctor" class="flex-grow-1" size="large">
                  <v-icon start size="24">mdi-doctor</v-icon>
                  پزشک
                </v-btn>
              </v-btn-toggle>
            </v-card-text>
          </v-card>

          <!-- User Login Form -->
          <v-card v-if="loginType === 'user'" class="clean-card" elevation="2">
            <div class="text-center pa-6 pb-4 login-header">
              <div class="login-icon-wrapper mb-4">
                <v-icon color="primary" size="80">mdi-account-circle</v-icon>
              </div>
              <h1 class="text-h4 font-weight-bold mb-2">
                ورود کاربر
              </h1>
              <p class="text-body-2 text-medium-emphasis">
                <v-icon size="16" class="mr-1">mdi-information</v-icon>
                برای رزرو نوبت وارد شوید
              </p>
            </div>

            <v-card-text class="pa-6 pt-0">
              <v-form ref="userForm" v-model="userValid">
                <v-text-field
                  v-model="userFormData.name"
                  label="نام و نام خانوادگی"
                  variant="outlined"
                  prepend-inner-icon="mdi-account"
                  :rules="[rules.required]"
                  class="mb-3"
                  density="comfortable"
                ></v-text-field>

                <v-text-field
                  v-model="userFormData.email"
                  label="ایمیل"
                  variant="outlined"
                  prepend-inner-icon="mdi-email"
                  type="email"
                  :rules="[rules.required, rules.email]"
                  class="mb-3"
                  density="comfortable"
                ></v-text-field>

                <v-text-field
                  v-model="userFormData.phone"
                  label="شماره تماس"
                  variant="outlined"
                  prepend-inner-icon="mdi-phone"
                  :rules="[rules.required]"
                  class="mb-4"
                  density="comfortable"
                ></v-text-field>

                <v-btn
                  color="primary"
                  variant="elevated"
                  size="large"
                  block
                  :disabled="!userValid"
                  @click="loginUser"
                  class="clean-btn login-submit-btn"
                >
                  <v-icon start size="24">mdi-login</v-icon>
                  <span class="text-h6 font-weight-bold">ورود</span>
                  <v-icon end size="20">mdi-arrow-left</v-icon>
                </v-btn>
              </v-form>
            </v-card-text>
          </v-card>

          <!-- Doctor Login Form -->
          <v-card v-else class="clean-card" elevation="2">
            <div class="text-center pa-6 pb-4 login-header">
              <div class="login-icon-wrapper mb-4">
                <v-icon color="success" size="80">mdi-doctor</v-icon>
              </div>
              <h1 class="text-h4 font-weight-bold mb-2">
                ورود پزشک
              </h1>
              <p class="text-body-2 text-medium-emphasis">
                <v-icon size="16" class="mr-1">mdi-information</v-icon>
                برای مدیریت نوبت‌ها وارد شوید
              </p>
            </div>

            <v-card-text class="pa-6 pt-0">
              <v-form ref="doctorForm" v-model="doctorValid">
                <v-select
                  v-model="doctorFormData.doctorId"
                  :items="doctorsList"
                  item-title="name"
                  item-value="id"
                  label="انتخاب پزشک"
                  variant="outlined"
                  prepend-inner-icon="mdi-doctor"
                  :rules="[rules.required]"
                  class="mb-3"
                  density="comfortable"
                ></v-select>

                <v-text-field
                  v-model="doctorFormData.name"
                  label="نام و نام خانوادگی"
                  variant="outlined"
                  prepend-inner-icon="mdi-account"
                  :rules="[rules.required]"
                  class="mb-3"
                  density="comfortable"
                ></v-text-field>

                <v-text-field
                  v-model="doctorFormData.email"
                  label="ایمیل"
                  variant="outlined"
                  prepend-inner-icon="mdi-email"
                  type="email"
                  :rules="[rules.required, rules.email]"
                  class="mb-3"
                  density="comfortable"
                ></v-text-field>

                <v-text-field
                  v-model="doctorFormData.phone"
                  label="شماره تماس"
                  variant="outlined"
                  prepend-inner-icon="mdi-phone"
                  :rules="[rules.required]"
                  class="mb-4"
                  density="comfortable"
                ></v-text-field>

                <v-btn
                  color="success"
                  variant="elevated"
                  size="large"
                  block
                  :disabled="!doctorValid"
                  @click="loginDoctor"
                  class="clean-btn login-submit-btn"
                >
                  <v-icon start size="24">mdi-login</v-icon>
                  <span class="text-h6 font-weight-bold">ورود</span>
                  <v-icon end size="20">mdi-arrow-left</v-icon>
                </v-btn>
              </v-form>
            </v-card-text>
          </v-card>

          <!-- Footer Info -->
          <v-card class="clean-card mt-4" elevation="0" variant="outlined">
            <v-card-text class="pa-4 text-center">
              <div class="d-flex align-center justify-center mb-2">
                <v-icon size="16" color="success" class="mr-1">mdi-shield-check</v-icon>
                <span class="text-caption text-medium-emphasis">امن و محرمانه</span>
              </div>
              <p class="text-caption text-medium-emphasis mb-0">
                با ورود به سیستم، شما شرایط و قوانین را می‌پذیرید.
              </p>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Login',
  data() {
    return {
      loginType: 'user',
      userValid: false,
      doctorValid: false,
      userFormData: {
        name: '',
        email: '',
        phone: ''
      },
      doctorFormData: {
        doctorId: null,
        name: '',
        email: '',
        phone: '',
        specialty: ''
      },
      rules: {
        required: value => !!value || 'این فیلد الزامی است',
        email: value => {
          const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
          return pattern.test(value) || 'ایمیل معتبر نیست'
        }
      }
    }
  },
  computed: {
    ...mapGetters(['doctors']),
    doctorsList() {
      return this.$store.state.doctors.map(doc => ({
        name: doc.name,
        id: doc.id,
        specialty: doc.specialty
      }))
    }
  },
  watch: {
    'doctorFormData.doctorId'(newId) {
      if (newId) {
        const doctor = this.$store.getters.getDoctorById(newId)
        if (doctor) {
          this.doctorFormData.specialty = doctor.specialty
          this.doctorFormData.name = doctor.name
          this.doctorFormData.email = doctor.email
          this.doctorFormData.phone = doctor.phone
        }
      }
    }
  },
  methods: {
    async loginUser() {
      if (this.$refs.userForm.validate()) {
        try {
          await this.$store.dispatch('loginUser', this.userFormData)
          const redirect = this.$route.query.redirect || '/'
          this.$router.push(redirect)
        } catch (error) {
          console.error('Login error:', error)
        }
      }
    },
    async loginDoctor() {
      if (this.$refs.doctorForm.validate()) {
        try {
          await this.$store.dispatch('loginDoctor', this.doctorFormData)
          this.$router.push({ name: 'DoctorPanel' })
        } catch (error) {
          console.error('Login error:', error)
        }
      }
    }
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
}

.login-header {
  background: rgba(25, 118, 210, 0.05);
  border-radius: 12px 12px 0 0;
}

.v-theme--dark .login-header {
  background: rgba(33, 150, 243, 0.1);
}

.login-icon-wrapper {
  display: inline-block;
  padding: 20px;
  border-radius: 50%;
  background: rgba(25, 118, 210, 0.1);
}

.v-theme--dark .login-icon-wrapper {
  background: rgba(33, 150, 243, 0.2);
}

.login-submit-btn {
  height: 56px;
}
</style>
