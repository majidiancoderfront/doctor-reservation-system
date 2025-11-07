<template>
  <v-container class="pa-4" style="max-width: 500px">
    <v-row justify="center" align="center" style="min-height: 80vh">
      <v-col cols="12">
        <v-card elevation="4" class="pa-6">
          <div class="text-center mb-6">
            <v-icon
              color="primary"
              size="64"
              class="mb-4"
            >
              mdi-account-circle
            </v-icon>
            <h1 class="text-h4 mb-2">ورود به سیستم</h1>
            <p class="text-medium-emphasis">
              برای رزرو نوبت لطفاً وارد شوید
            </p>
          </div>

          <v-form ref="form" v-model="valid">
            <v-text-field
              v-model="formData.name"
              label="نام و نام خانوادگی"
              variant="outlined"
              prepend-inner-icon="mdi-account"
              :rules="[rules.required]"
              class="mb-3"
            ></v-text-field>

            <v-text-field
              v-model="formData.email"
              label="ایمیل"
              variant="outlined"
              prepend-inner-icon="mdi-email"
              type="email"
              :rules="[rules.required, rules.email]"
              class="mb-3"
            ></v-text-field>

            <v-text-field
              v-model="formData.phone"
              label="شماره تماس"
              variant="outlined"
              prepend-inner-icon="mdi-phone"
              :rules="[rules.required]"
              class="mb-4"
            ></v-text-field>

            <v-btn
              color="primary"
              variant="elevated"
              size="large"
              block
              :disabled="!valid"
              @click="login"
            >
              <i class="fas fa-sign-in-alt mr-2"></i>
              ورود
            </v-btn>
          </v-form>

          <v-divider class="my-4"></v-divider>

          <div class="text-center">
            <p class="text-caption text-medium-emphasis">
              با ورود به سیستم، شما شرایط و قوانین را می‌پذیرید.
            </p>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions } from 'vuex'
import { gsap } from 'gsap'

export default {
  name: 'Login',
  data() {
    return {
      valid: false,
      formData: {
        name: '',
        email: '',
        phone: ''
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
  mounted() {
    this.animatePage()
  },
  methods: {
    async login() {
      if (this.$refs.form.validate()) {
        try {
          await this.$store.dispatch('login', this.formData)
          const redirect = this.$route.query.redirect || '/'
          this.$router.push(redirect)
        } catch (error) {
          console.error('Login error:', error)
        }
      }
    },
    animatePage() {
      gsap.from('.v-card', {
        opacity: 0,
        scale: 0.9,
        duration: 0.5,
        ease: 'power2.out'
      })
    }
  }
}
</script>

<style scoped>
.v-card {
  border-radius: 16px;
}
</style>

