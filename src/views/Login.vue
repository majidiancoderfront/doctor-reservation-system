<template>
  <div class="login-page">
    <v-container class="py-6">
      <v-row justify="center" align="center" style="min-height: 80vh">
        <v-col cols="12" sm="8" md="6" lg="5">
          <v-card class="clean-card" elevation="2">
            <div class="text-center pa-6 pb-4 login-header">
              <div class="login-icon-wrapper mb-4">
                <v-icon
                  color="primary"
                  size="80"
                >
                  mdi-account-circle
                </v-icon>
              </div>
              <h1 class="text-h4 font-weight-bold mb-2">
                <v-icon size="28" class="mr-2">mdi-login</v-icon>
                ورود به سیستم
              </h1>
              <p class="text-body-2 text-medium-emphasis">
                <v-icon size="16" class="mr-1">mdi-information</v-icon>
                برای رزرو نوبت لطفاً وارد شوید
              </p>
            </div>

            <v-card-text class="pa-6 pt-0">
              <v-form ref="form" v-model="valid">
                <v-text-field
                  v-model="formData.name"
                  label="نام و نام خانوادگی"
                  variant="outlined"
                  prepend-inner-icon="mdi-account"
                  :rules="[rules.required]"
                  class="mb-3"
                  density="comfortable"
                ></v-text-field>

                <v-text-field
                  v-model="formData.email"
                  label="ایمیل"
                  variant="outlined"
                  prepend-inner-icon="mdi-email"
                  type="email"
                  :rules="[rules.required, rules.email]"
                  class="mb-3"
                  density="comfortable"
                ></v-text-field>

                <v-text-field
                  v-model="formData.phone"
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
                  :disabled="!valid"
                  @click="login"
                  class="clean-btn login-submit-btn"
                >
                  <v-icon start size="24">mdi-login</v-icon>
                  <span class="text-h6 font-weight-bold">ورود</span>
                  <v-icon end size="20">mdi-arrow-left</v-icon>
                </v-btn>
              </v-form>
            </v-card-text>

            <v-divider class="mx-6"></v-divider>

            <v-card-text class="pa-6 pt-4">
              <div class="text-center">
                <div class="d-flex align-center justify-center mb-2">
                  <v-icon size="16" color="success" class="mr-1">mdi-shield-check</v-icon>
                  <span class="text-caption text-medium-emphasis">امن و محرمانه</span>
                </div>
                <p class="text-caption text-medium-emphasis">
                  با ورود به سیستم، شما شرایط و قوانین را می‌پذیرید.
                </p>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
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
