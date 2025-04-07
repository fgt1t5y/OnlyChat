import { createRouter, createWebHistory } from 'vue-router'
import MainView from '@/views/MainView.vue'
import DebugView from '@/views/DebugView.vue'
import AuthView from '@/views/AuthView.vue'
import Main from '@/layouts/Main.vue'
import Blank from '@/layouts/Blank.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: Main,
      children: [
        {
          path: '',
          name: 'home',
          component: MainView,
        },
      ],
    },
    {
      path: '/auth',
      component: Blank,
      children: [
        {
          path: '',
          name: 'auth',
          component: AuthView,
        },
      ],
    },
    {
      path: '/debug',
      name: 'debug',
      component: DebugView,
    },
  ],
})

export default router
