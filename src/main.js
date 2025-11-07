import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import './assets/main.css'

const app = createApp(App)

app.use(store)
app.use(router)
app.use(vuetify)

app.mount('#app')

