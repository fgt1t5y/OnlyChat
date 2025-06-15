import '@/styles/app.css'
import '@/styles/tabler-icons.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import OnlyChat from './theme'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn';
import relativeTime from 'dayjs/plugin/relativeTime'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import LocalizedFormat from 'dayjs/plugin/localizedFormat'
import ToastService from 'primevue/toastservice'
import i18n from './i18n'
import App from './App.vue'
import router from './router'

dayjs.locale('zh-cn')
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(relativeTime)
dayjs.extend(LocalizedFormat)
dayjs.tz.setDefault('Asia/Shanghai')

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
app.use(ToastService)
app.use(i18n)
app.mount(document.body)
