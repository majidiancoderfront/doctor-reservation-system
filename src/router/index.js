import { createRouter, createWebHistory } from 'vue-router'
import store from '@/store'
import Home from '@/views/Home.vue'
import DoctorDetails from '@/views/DoctorDetails.vue'
import Booking from '@/views/Booking.vue'
import Profile from '@/views/Profile.vue'
import Login from '@/views/Login.vue'
import DoctorPanel from '@/views/DoctorPanel.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/doctor/:id',
    name: 'DoctorDetails',
    component: DoctorDetails,
    props: true
  },
  {
    path: '/booking/:doctorId',
    name: 'Booking',
    component: Booking,
    props: true,
    meta: { requiresAuth: true, requiresUser: true }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: { requiresAuth: true, requiresUser: true }
  },
  {
    path: '/doctor-panel',
    name: 'DoctorPanel',
    component: DoctorPanel,
    meta: { requiresAuth: true, requiresDoctor: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const currentUser = store.getters.currentUser
  const isDoctor = store.getters.isDoctor
  const isUser = store.getters.isUser

  if (to.meta.requiresAuth && !currentUser) {
    next({ name: 'Login', query: { redirect: to.fullPath } })
  } else if (to.meta.requiresUser && !isUser) {
    next({ name: 'Home' })
  } else if (to.meta.requiresDoctor && !isDoctor) {
    next({ name: 'Home' })
  } else {
    next()
  }
})

export default router

