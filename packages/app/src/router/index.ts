import { createRouter, createWebHistory } from 'vue-router'
import AuthView from '@/views/AuthView.vue'
import MainView from '@/views/MainView.vue'
import HomeAside from '@/views/aside/HomeAside.vue'
import FriendAddPage from '@/views/page/FriendAddPage.vue'
import FriendListPage from '@/views/page/FriendListPage.vue'
import SettingsAside from '@/views/aside/SettingsAside.vue'
import ThemePage from '@/views/page/settings/ThemePage.vue'

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
          redirect() {
            return { name: 'friend_list' }
          },
        },
        {
          path: 'friend/list',
          name: 'friend_list',
          components: {
            aside: HomeAside,
            default: FriendAddPage,
          },
        },
        {
          path: 'friend/add',
          name: 'friend_find',
          components: {
            aside: HomeAside,
            default: FriendListPage,
          },
        },
      ],
    },
    {
      path: '/settings',
      component: MainView,
      children: [
        {
          path: '',
          name: 'settings',
          redirect() {
            return { name: 'settings_theme' }
          },
        },
        {
          path: 'settings/theme',
          name: 'settings_theme',
          components: {
            aside: SettingsAside,
            default: ThemePage,
          },
        },
      ],
    },
    {
      path: '/login',
      name: 'login',
      component: AuthView,
    },
  ],
})

export default router
