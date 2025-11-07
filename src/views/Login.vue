<template>
  <div class="login-page">
    <v-container class="py-8">
      <v-row justify="center" align="center" style="min-height: 80vh">
        <v-col cols="12" sm="10" md="8" lg="6">
          <!-- Type Selection -->
          <v-card class="mb-4" elevation="2">
            <v-card-text class="pa-4">
              <div class="text-center mb-4">
                <h2 class="text-h5 font-weight-bold mb-2">
                  <v-icon size="28" class="ml-2">mdi-account-circle</v-icon>
                  ورود / ثبت‌نام
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
                class="w-100"
              >
                <v-btn value="user" class="flex-grow-1">
                  <v-icon start>mdi-account</v-icon>
                  کاربر
                </v-btn>
                <v-btn value="doctor" class="flex-grow-1">
                  <v-icon start>mdi-doctor</v-icon>
                  پزشک
                </v-btn>
              </v-btn-toggle>
            </v-card-text>
          </v-card>

          <!-- User Form -->
          <v-card v-if="loginType === 'user'" elevation="2">
            <v-card-title class="text-center pa-6 pb-2">
              <v-icon size="64" color="primary" class="mb-3">mdi-account-circle</v-icon>
              <h1 class="text-h5 font-weight-bold">
                {{ isRegisterMode ? 'ثبت‌نام کاربر' : 'ورود کاربر' }}
              </h1>
            </v-card-title>

            <v-card-text class="pa-6">
              <div class="text-center mb-4">
                <v-btn-toggle
                  v-model="isRegisterMode"
                  mandatory
                  variant="outlined"
                  density="compact"
                >
                  <v-btn :value="false">
                    <v-icon start>mdi-login</v-icon>
                    ورود
                  </v-btn>
                  <v-btn :value="true">
                    <v-icon start>mdi-account-plus</v-icon>
                    ثبت‌نام
                  </v-btn>
                </v-btn-toggle>
              </div>

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
                  :rules="[rules.required, rules.phone]"
                  class="mb-3"
                  density="comfortable"
                ></v-text-field>

                <v-text-field
                  v-if="isRegisterMode"
                  v-model="userFormData.password"
                  label="رمز عبور"
                  variant="outlined"
                  prepend-inner-icon="mdi-lock"
                  type="password"
                  :rules="isRegisterMode ? [rules.required, rules.password] : []"
                  class="mb-3"
                  density="comfortable"
                ></v-text-field>

                <v-text-field
                  v-if="isRegisterMode"
                  v-model="userFormData.confirmPassword"
                  label="تکرار رمز عبور"
                  variant="outlined"
                  prepend-inner-icon="mdi-lock-check"
                  type="password"
                  :rules="isRegisterMode ? [rules.required, rules.confirmPassword] : []"
                  class="mb-4"
                  density="comfortable"
                ></v-text-field>

                <v-btn
                  color="primary"
                  variant="elevated"
                  size="large"
                  block
                  :disabled="!userValid"
                  @click="isRegisterMode ? registerUser() : loginUser()"
                >
                  <v-icon start>{{ isRegisterMode ? 'mdi-account-plus' : 'mdi-login' }}</v-icon>
                  {{ isRegisterMode ? 'ثبت‌نام' : 'ورود' }}
                </v-btn>

                <div class="text-center mt-4">
                  <v-btn
                    variant="text"
                    size="small"
                    @click="isRegisterMode = !isRegisterMode"
                  >
                    {{ isRegisterMode ? 'قبلاً ثبت‌نام کرده‌اید؟ ورود' : 'حساب کاربری ندارید؟ ثبت‌نام' }}
                  </v-btn>
                </div>
              </v-form>
            </v-card-text>
          </v-card>

          <!-- Doctor Form -->
          <v-card v-else elevation="2">
            <v-card-title class="text-center pa-6 pb-2">
              <v-icon size="64" color="success" class="mb-3">mdi-doctor</v-icon>
              <h1 class="text-h5 font-weight-bold">ورود پزشک</h1>
            </v-card-title>

            <v-card-text class="pa-6">
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
                >
                  <v-icon start>mdi-login</v-icon>
                  ورود
                </v-btn>
              </v-form>
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
      isRegisterMode: false,
      userValid: false,
      doctorValid: false,
      userFormData: {
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
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
        },
        phone: value => {
          const pattern = /^[0-9]{10,11}$/
          return pattern.test(value?.replace(/[-\s]/g, '')) || 'شماره تماس معتبر نیست'
        },
        password: value => {
          if (!value) return 'رمز عبور الزامی است'
          if (value.length < 6) return 'رمز عبور باید حداقل 6 کاراکتر باشد'
          return true
        },
        confirmPassword: value => {
          if (!value) return 'تکرار رمز عبور الزامی است'
          if (value !== this.userFormData.password) return 'رمز عبور با تکرار آن مطابقت ندارد'
          return true
        }
      }
    }
  },
  computed: {
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
    },
    isRegisterMode() {
      this.userFormData.password = ''
      this.userFormData.confirmPassword = ''
      if (this.$refs.userForm) {
        this.$refs.userForm.resetValidation()
      }
    }
  },
  methods: {
    async loginUser() {
      if (this.$refs.userForm.validate()) {
        try {
          await this.$store.dispatch('loginUser', {
            name: this.userFormData.name,
            email: this.userFormData.email,
            phone: this.userFormData.phone
          })
          const redirect = this.$route.query.redirect || '/'
          this.$router.push(redirect)
        } catch (error) {
          console.error('Login error:', error)
        }
      }
    },
    async registerUser() {
      if (this.$refs.userForm.validate()) {
        try {
          await this.$store.dispatch('loginUser', {
            name: this.userFormData.name,
            email: this.userFormData.email,
            phone: this.userFormData.phone
          })
          const redirect = this.$route.query.redirect || '/'
          this.$router.push(redirect)
        } catch (error) {
          console.error('Registration error:', error)
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
</style>
