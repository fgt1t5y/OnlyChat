import '@/styles/app.css'
import '@/styles/tabler-icons.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import OnlyChat from './theme'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import LocalizedFormat from 'dayjs/plugin/localizedFormat'

import App from './App.vue'
import router from './router'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(relativeTime)
dayjs.extend(LocalizedFormat)

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(PrimeVue, {
  theme: {
    preset: OnlyChat,
    options: {
      darkModeSelector: '.dark',
    },
  },
})

app.mount(document.body)
