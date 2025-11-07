import { createStore } from 'vuex'

export default createStore({
  state: {
    user: null,
    doctors: [
      {
        id: 1,
        name: 'دکتر احمد محمدی',
        specialty: 'قلب و عروق',
        image: 'https://via.placeholder.com/300x300?text=دکتر+احمد+محمدی',
        phone: '021-12345678',
        email: 'ahmad.mohammadi@example.com',
        address: 'تهران، خیابان ولیعصر، پلاک 123',
        experience: '15 سال',
        rating: 4.8,
        reviews: [
          { id: 1, user: 'علی رضایی', rating: 5, comment: 'دکتر بسیار حرفه‌ای و دلسوز هستند.' },
          { id: 2, user: 'مریم کریمی', rating: 4, comment: 'نوبت‌دهی سریع و مناسب بود.' }
        ],
        availableSlots: [
          { date: '2024-01-15', times: ['09:00', '10:00', '11:00', '14:00', '15:00'] },
          { date: '2024-01-16', times: ['09:00', '10:00', '14:00', '15:00', '16:00'] },
          { date: '2024-01-17', times: ['09:00', '11:00', '14:00', '15:00'] }
        ]
      },
      {
        id: 2,
        name: 'دکتر فاطمه احمدی',
        specialty: 'پزشک عمومی',
        image: 'https://via.placeholder.com/300x300?text=دکتر+فاطمه+احمدی',
        phone: '021-87654321',
        email: 'fateme.ahmadi@example.com',
        address: 'تهران، خیابان انقلاب، پلاک 456',
        experience: '10 سال',
        rating: 4.6,
        reviews: [
          { id: 3, user: 'حسین نوری', rating: 5, comment: 'بهترین پزشک عمومی که دیدم.' },
          { id: 4, user: 'سارا موسوی', rating: 4, comment: 'خیلی خوش برخورد و صبور.' }
        ],
        availableSlots: [
          { date: '2024-01-15', times: ['08:00', '09:00', '10:00', '13:00', '14:00'] },
          { date: '2024-01-16', times: ['08:00', '09:00', '13:00', '14:00', '15:00'] }
        ]
      },
      {
        id: 3,
        name: 'دکتر محسن رضایی',
        specialty: 'ارتوپدی',
        image: 'https://via.placeholder.com/300x300?text=دکتر+محسن+رضایی',
        phone: '021-11223344',
        email: 'mohsen.rezaei@example.com',
        address: 'تهران، خیابان آزادی، پلاک 789',
        experience: '20 سال',
        rating: 4.9,
        reviews: [
          { id: 5, user: 'رضا کریمی', rating: 5, comment: 'دکتر رضایی عالی هستند.' },
          { id: 6, user: 'لیلا احمدی', rating: 5, comment: 'تشخیص دقیق و درمان موثر.' }
        ],
        availableSlots: [
          { date: '2024-01-15', times: ['10:00', '11:00', '15:00', '16:00'] },
          { date: '2024-01-16', times: ['10:00', '11:00', '14:00', '15:00', '16:00'] },
          { date: '2024-01-17', times: ['09:00', '10:00', '14:00', '15:00'] }
        ]
      },
      {
        id: 4,
        name: 'دکتر زهرا حسینی',
        specialty: 'پزشک اطفال',
        image: 'https://via.placeholder.com/300x300?text=دکتر+زهرا+حسینی',
        phone: '021-55667788',
        email: 'zahra.hosseini@example.com',
        address: 'تهران، خیابان ولیعصر، پلاک 321',
        experience: '12 سال',
        rating: 4.7,
        reviews: [
          { id: 7, user: 'محمد علیزاده', rating: 5, comment: 'با بچه‌ها خیلی خوب برخورد می‌کنند.' },
          { id: 8, user: 'نرگس رضایی', rating: 4, comment: 'پزشک دلسوز و حرفه‌ای.' }
        ],
        availableSlots: [
          { date: '2024-01-15', times: ['08:00', '09:00', '10:00', '13:00', '14:00'] },
          { date: '2024-01-16', times: ['08:00', '09:00', '13:00', '14:00'] }
        ]
      }
    ],
    appointments: []
  },
  mutations: {
    setUser(state, user) {
      state.user = user
    },
    addAppointment(state, appointment) {
      state.appointments.push(appointment)
    },
    updateAppointment(state, { id, appointment }) {
      const index = state.appointments.findIndex(a => a.id === id)
      if (index !== -1) {
        state.appointments[index] = { ...state.appointments[index], ...appointment }
      }
    },
    deleteAppointment(state, id) {
      state.appointments = state.appointments.filter(a => a.id !== id)
    }
  },
  actions: {
    login({ commit }, userData) {
      const user = {
        id: Date.now(),
        name: userData.name,
        email: userData.email,
        phone: userData.phone
      }
      commit('setUser', user)
      return Promise.resolve(user)
    },
    bookAppointment({ commit }, appointmentData) {
      const appointment = {
        id: Date.now(),
        ...appointmentData,
        status: 'confirmed',
        createdAt: new Date().toISOString()
      }
      commit('addAppointment', appointment)
      return Promise.resolve(appointment)
    }
  },
  getters: {
    getDoctorById: (state) => (id) => {
      return state.doctors.find(doctor => doctor.id === parseInt(id))
    },
    getUserAppointments: (state) => {
      if (!state.user) return []
      return state.appointments.filter(apt => apt.userId === state.user.id)
    },
    filteredDoctors: (state) => (searchQuery) => {
      if (!searchQuery) return state.doctors
      const query = searchQuery.toLowerCase()
      return state.doctors.filter(doctor =>
        doctor.name.toLowerCase().includes(query) ||
        doctor.specialty.toLowerCase().includes(query)
      )
    }
  }
})

