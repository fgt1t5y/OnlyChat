import { createRouter, createWebHistory } from 'vue-router'
import AuthView from '@/views/AuthView.vue'
import MainView from '@/views/MainView.vue'
import HomeAside from '@/views/aside/HomeAside.vue'
import FriendsPage from '@/views/page/FriendsPage.vue'
import FindFriendPage from '@/views/page/FindFriendPage.vue'

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
            return { name: 'friends' }
          },
        },
        {
          path: 'friends',
          name: 'friends',
          components: {
            aside: HomeAside,
            default: FriendsPage,
          },
        },
        {
          path: 'friends/find',
          name: 'find_friend',
          components: {
            aside: HomeAside,
            default: FindFriendPage,
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
