import { createRouter, createWebHistory } from 'vue-router'
import AuthView from '@/views/AuthView.vue'
import MainView from '@/views/MainView.vue'
import Blank from '@/layouts/Blank.vue'
import HomeAside from '@/views/aside/HomeAside.vue'
import HomePage from '@/views/page/HomePage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: MainView,
      children: [
        {
          path: '',
          name: 'home',
          components: {
            default: HomePage,
            aside: HomeAside,
          },
        },
      ],
    },
    {
      path: '/login',
      component: Blank,
      children: [
        {
          path: '',
          name: 'login',
          component: AuthView,
        },
      ],
    },
  ],
})

export default router
