import { createRouter, createWebHistory } from 'vue-router'
import AuthView from '@/views/AuthView.vue'
import MainView from '@/views/MainView.vue'
import HomeAside from '@/views/aside/HomeAside.vue'
import FriendsPage from '@/views/page/FriendsPage.vue'
import AddFriendPage from '@/views/page/AddFriendPage.vue'
import SettingsAside from '@/views/aside/SettingsAside.vue'
import ProfilePage from '@/views/page/settings/ProfilePage.vue'
import AvatarPage from '@/views/page/settings/AvatarPage.vue'
import ThemePage from '@/views/page/settings/ThemePage.vue'
import FriendRequestsPage from '@/views/page/FriendRequestsPage.vue'

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
            default: FriendsPage,
          },
        },
        {
          path: 'friend/requests',
          name: 'friend_request_list',
          components: {
            aside: HomeAside,
            default: FriendRequestsPage,
          },
        },
        {
          path: 'friend/add',
          name: 'friend_find',
          components: {
            aside: HomeAside,
            default: AddFriendPage,
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
            return { name: 'settings_profile' }
          },
        },
        {
          path: 'profile',
          name: 'settings_profile',
          components: {
            aside: SettingsAside,
            default: ProfilePage,
          },
        },
        {
          path: 'avatar',
          name: 'settings_avatar',
          components: {
            aside: SettingsAside,
            default: AvatarPage,
          },
        },
        {
          path: 'theme',
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
