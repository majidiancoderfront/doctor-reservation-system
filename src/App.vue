<template>
  <v-app>
    <!-- Enhanced Header with Search -->
    <v-app-bar
      app
      color="primary"
      dark
      elevation="2"
      height="72"
    >
      <v-app-bar-nav-icon
        v-if="$vuetify.display.mobile"
        @click="drawer = !drawer"
      ></v-app-bar-nav-icon>
      
      <v-toolbar-title class="d-flex align-center">
        <v-icon size="28" class="mr-2">mdi-doctor</v-icon>
        <span class="text-body-1 font-weight-medium d-none d-sm-inline">سیستم رزرو وقت دکتر</span>
        <span class="text-body-2 d-sm-none">رزرو وقت</span>
      </v-toolbar-title>

      <!-- Search Bar in Navbar -->
      <v-spacer></v-spacer>
      <div class="d-none d-md-flex align-center" style="max-width: 400px; width: 100%;">
        <v-text-field
          v-model="searchQuery"
          prepend-inner-icon="mdi-magnify"
          placeholder="پزشک یا تخصص را جستجو کنید..."
          variant="solo-filled"
          density="compact"
          hide-details
          clearable
          flat
          class="navbar-search"
        ></v-text-field>
      </div>

      <v-spacer v-if="!$vuetify.display.mdAndUp"></v-spacer>

      <v-btn
        icon
        @click="toggleTheme"
        variant="text"
        size="small"
        class="mr-1"
      >
        <v-icon size="20">{{ isDark ? 'mdi-weather-sunny' : 'mdi-weather-night' }}</v-icon>
      </v-btn>

      <v-menu v-if="currentUser" location="bottom">
        <template v-slot:activator="{ props }">
          <v-btn
            icon
            v-bind="props"
            variant="text"
            size="small"
          >
            <v-avatar size="32" color="white">
              <v-icon :color="isDoctor ? 'success' : 'primary'" size="18">
                {{ isDoctor ? 'mdi-doctor' : 'mdi-account' }}
              </v-icon>
            </v-avatar>
          </v-btn>
        </template>
        <v-list min-width="180">
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
          <v-divider></v-divider>
          <v-list-item
            prepend-icon="mdi-logout"
            @click="logout"
          >
            خروج
          </v-list-item>
        </v-list>
      </v-menu>

      <v-btn
        v-else
        :to="{ name: 'Login' }"
        variant="text"
        size="small"
        class="text-white mr-1"
      >
        <v-icon start size="18">mdi-login</v-icon>
        <span class="d-none d-sm-inline">ورود</span>
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer
      v-model="drawer"
      temporary
      app
      v-if="$vuetify.display.mobile"
    >
      <v-list>
        <v-list-item
          prepend-icon="mdi-home"
          :to="{ name: 'Home' }"
          title="صفحه اصلی"
        ></v-list-item>
        <v-list-item
          v-if="user"
          prepend-icon="mdi-account"
          :to="{ name: 'Profile' }"
          title="پروفایل کاربر"
        ></v-list-item>
        <v-list-item
          v-if="doctor"
          prepend-icon="mdi-view-dashboard"
          :to="{ name: 'DoctorPanel' }"
          title="پنل پزشک"
        ></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <router-view v-slot="{ Component, route }">
        <transition
          name="fade"
          mode="out-in"
        >
          <component :is="Component" :key="route.path" />
        </transition>
      </router-view>
    </v-main>

    <!-- Simple Footer -->
    <v-footer
      app
      color="surface"
      height="56"
      class="border-t"
    >
      <v-container class="py-2">
        <div class="text-center text-caption text-medium-emphasis">
          <v-icon size="14" class="mr-1">mdi-copyright</v-icon>
          {{ new Date().getFullYear() }} سیستم رزرو وقت دکتر
        </div>
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
      drawer: false,
      searchQuery: ''
    }
  },
  computed: {
    ...mapState(['user']),
    isDark() {
      return this.$vuetify.theme.current.dark
    }
  },
  watch: {
    searchQuery(newVal) {
      this.$store.commit('setSearchQuery', newVal)
    }
  },
  methods: {
    ...mapMutations(['setUser']),
    toggleTheme() {
      this.$vuetify.theme.global.name = this.isDark ? 'light' : 'dark'
    },
    logout() {
      this.setUser(null)
      this.$router.push({ name: 'Home' })
    }
  }
}
</script>

<style scoped>
.border-t {
  border-top: 1px solid rgba(0, 0, 0, 0.12);
}

.v-theme--dark .border-t {
  border-top-color: rgba(255, 255, 255, 0.12);
}

.navbar-search {
  margin: 0 8px;
}

.navbar-search :deep(.v-field) {
  background: rgba(255, 255, 255, 0.15) !important;
}

.navbar-search :deep(.v-field--focused) {
  background: rgba(255, 255, 255, 0.25) !important;
}

.navbar-search :deep(.v-field__input) {
  color: white;
}

.navbar-search :deep(.v-field__input::placeholder) {
  color: rgba(255, 255, 255, 0.7);
}
</style>
