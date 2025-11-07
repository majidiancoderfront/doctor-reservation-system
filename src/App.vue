<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
      elevation="2"
    >
      <v-app-bar-nav-icon
        v-if="$vuetify.display.mobile"
        @click="drawer = !drawer"
      ></v-app-bar-nav-icon>
      
      <v-toolbar-title class="d-flex align-center">
        <i class="fas fa-user-doctor mr-2"></i>
        سیستم رزرو وقت دکتر
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn
        icon
        @click="toggleTheme"
        class="mr-2"
      >
        <v-icon>{{ isDark ? 'mdi-weather-sunny' : 'mdi-weather-night' }}</v-icon>
      </v-btn>

      <v-menu v-if="user">
        <template v-slot:activator="{ props }">
          <v-btn
            icon
            v-bind="props"
          >
            <v-avatar size="32">
              <v-icon>mdi-account</v-icon>
            </v-avatar>
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            prepend-icon="mdi-account"
            :to="{ name: 'Profile' }"
          >
            پروفایل
          </v-list-item>
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
      >
        ورود
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
          title="پروفایل"
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

    <v-footer
      app
      color="primary"
      dark
    >
      <v-spacer></v-spacer>
      <div>&copy; {{ new Date().getFullYear() }} سیستم رزرو وقت دکتر</div>
    </v-footer>
  </v-app>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { useTheme } from 'vuetify'

export default {
  name: 'App',
  data() {
    return {
      drawer: false,
    }
  },
  computed: {
    ...mapState(['user']),
    isDark() {
      return this.$vuetify.theme.current.dark
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
.v-toolbar-title {
  font-weight: 600;
}
</style>

