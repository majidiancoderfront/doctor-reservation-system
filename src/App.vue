<template>
  <v-app>
    <!-- Header -->
    <v-app-bar
      app
      elevation="1"
      height="70"
      color="surface"
    >
      <v-container class="d-flex align-center" fluid>
        <!-- Logo -->
        <router-link to="/" class="d-flex align-center text-decoration-none">
          <v-icon size="28" color="primary" class="ml-2">mdi-hospital</v-icon>
          <div>
            <div class="text-subtitle-1 font-weight-bold text-primary">سیستم رزرو وقت</div>
            <div class="text-caption text-medium-emphasis">پزشک آنلاین</div>
          </div>
        </router-link>

        <v-spacer></v-spacer>

        <!-- Navigation -->
        <div class="d-none d-md-flex align-center" style="gap: 8px;">
          <v-btn
            :to="{ name: 'Home' }"
            variant="text"
            :color="$route.name === 'Home' ? 'primary' : 'default'"
          >
            <v-icon start>mdi-home</v-icon>
            صفحه اصلی
          </v-btn>
          <v-btn
            v-if="isUser"
            :to="{ name: 'Profile' }"
            variant="text"
            :color="$route.name === 'Profile' ? 'primary' : 'default'"
          >
            <v-icon start>mdi-account</v-icon>
            پروفایل
          </v-btn>
          <v-btn
            v-if="isDoctor"
            :to="{ name: 'DoctorPanel' }"
            variant="text"
            :color="$route.name === 'DoctorPanel' ? 'primary' : 'default'"
          >
            <v-icon start>mdi-view-dashboard</v-icon>
            پنل پزشک
          </v-btn>
        </div>

        <v-spacer></v-spacer>

        <!-- Actions -->
        <div class="d-flex align-center" style="gap: 8px;">
          <v-btn
            icon
            variant="text"
            @click="toggleTheme"
            size="small"
          >
            <v-icon>{{ isDark ? 'mdi-weather-sunny' : 'mdi-weather-night' }}</v-icon>
          </v-btn>

          <v-menu v-if="currentUser" location="bottom end">
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                variant="text"
                class="d-flex align-center"
              >
                <v-avatar size="32" color="primary">
                  <v-icon color="white" size="18">
                    {{ isDoctor ? 'mdi-doctor' : 'mdi-account' }}
                  </v-icon>
                </v-avatar>
                <span class="d-none d-md-inline mr-2 text-body-2">{{ currentUser.name }}</span>
              </v-btn>
            </template>
            <v-list>
              <v-list-item
                v-if="isUser"
                prepend-icon="mdi-account"
                :to="{ name: 'Profile' }"
              >
                پروفایل کاربر
              </v-list-item>
              <v-list-item
                v-if="isDoctor"
                prepend-icon="mdi-view-dashboard"
                :to="{ name: 'DoctorPanel' }"
              >
                پنل پزشک
              </v-list-item>
              <v-divider class="my-2"></v-divider>
              <v-list-item prepend-icon="mdi-logout" @click="logout">
                خروج
              </v-list-item>
            </v-list>
          </v-menu>

          <v-btn
            v-else
            :to="{ name: 'Login' }"
            color="primary"
            variant="elevated"
          >
            <v-icon start>mdi-login</v-icon>
            <span class="d-none d-sm-inline">ورود</span>
          </v-btn>

          <v-app-bar-nav-icon
            v-if="$vuetify.display.mobile"
            @click="drawer = !drawer"
          ></v-app-bar-nav-icon>
        </div>
      </v-container>
    </v-app-bar>

    <!-- Mobile Drawer -->
    <v-navigation-drawer
      v-model="drawer"
      temporary
      app
    >
      <v-list>
        <v-list-item
          prepend-icon="mdi-home"
          :to="{ name: 'Home' }"
          title="صفحه اصلی"
          @click="drawer = false"
        ></v-list-item>
        <v-list-item
          v-if="isUser"
          prepend-icon="mdi-account"
          :to="{ name: 'Profile' }"
          title="پروفایل"
          @click="drawer = false"
        ></v-list-item>
        <v-list-item
          v-if="isDoctor"
          prepend-icon="mdi-view-dashboard"
          :to="{ name: 'DoctorPanel' }"
          title="پنل پزشک"
          @click="drawer = false"
        ></v-list-item>
        <v-divider class="my-2"></v-divider>
        <v-list-item
          v-if="currentUser"
          prepend-icon="mdi-logout"
          title="خروج"
          @click="logout"
        ></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- Main Content -->
    <v-main>
      <router-view v-slot="{ Component, route }">
        <transition name="fade" mode="out-in">
          <component :is="Component" :key="route.path" />
        </transition>
      </router-view>
    </v-main>

    <!-- Footer -->
    <v-footer app color="surface" elevation="2">
      <v-container>
        <v-row>
          <v-col cols="12" md="6">
            <div class="d-flex align-center mb-2">
              <v-icon size="20" color="primary" class="ml-2">mdi-hospital</v-icon>
              <span class="text-subtitle-1 font-weight-bold">سیستم رزرو وقت پزشک</span>
            </div>
            <p class="text-body-2 text-medium-emphasis">
              سامانه آنلاین رزرو نوبت پزشک
            </p>
          </v-col>
          <v-col cols="12" md="6" class="text-left text-md-right">
            <div class="text-body-2 text-medium-emphasis">
              <v-icon size="14" class="ml-1">mdi-copyright</v-icon>
              تمامی حقوق محفوظ است © {{ new Date().getFullYear() }}
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-footer>
  </v-app>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'App',
  data() {
    return {
      drawer: false
    }
  },
  computed: {
    ...mapState(['user', 'doctor']),
    ...mapGetters(['currentUser', 'isDoctor', 'isUser']),
    isDark() {
      return this.$vuetify.theme.current.dark
    }
  },
  methods: {
    toggleTheme() {
      this.$vuetify.theme.global.name = this.isDark ? 'light' : 'dark'
    },
    logout() {
      this.$store.dispatch('logout')
      this.drawer = false
      this.$router.push({ name: 'Home' })
    }
  }
}
</script>

<style scoped>
</style>
