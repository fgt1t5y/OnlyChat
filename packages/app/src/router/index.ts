import { createRouter, createWebHistory } from 'vue-router'
import AuthView from '@/views/AuthView.vue'
import MainView from '@/views/MainView.vue'
import HomeAside from '@/views/aside/HomeAside.vue'
import FriendsPage from '@/views/page/FriendsPage.vue'
import AddFriendPage from '@/views/page/AddFriendPage.vue'
import SettingsAside from '@/views/aside/SettingsAside.vue'
import ProfilesPage from '@/views/page/settings/ProfilesPage.vue'
import AvatarPage from '@/views/page/settings/AvatarPage.vue'
import FriendRequestsPage from '@/views/page/FriendRequestsPage.vue'
import DMChatPage from '@/views/page/DMChatPage.vue'
import MyAccountPage from '@/views/page/settings/MyAccountPage.vue'
import AppearancePage from '@/views/page/settings/AppearancePage.vue'
import ServerChannelsAside from '@/views/aside/ServerChannelsAside.vue'
import ServerChannelsPage from '@/views/page/ServerChannelsPage.vue'

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
          path: 'friend/requests',
          name: 'friend_requests',
          components: {
            aside: HomeAside,
            default: FriendRequestsPage,
          },
        },
        {
          path: 'friend/add',
          name: 'friend_add',
          components: {
            aside: HomeAside,
            default: AddFriendPage,
          },
        },
        {
          path: 'dm/:dmSessionId(\\d+)',
          name: 'dm',
          components: {
            aside: HomeAside,
            default: DMChatPage,
          },
        },
      ],
    },
    {
      path: '/server/:serverId(\\d+)',
      component: MainView,
      children: [
        {
          path: '',
          name: 'server',
          redirect() {
            return { name: 'server_channels' }
          },
        },
        {
          path: 'channels',
          name: 'server_channels',
          components: {
            aside: ServerChannelsAside,
            default: ServerChannelsPage,
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
            return { name: 'settings_my_account' }
          },
        },
        {
          path: 'my_account',
          name: 'settings_my_account',
          components: {
            aside: SettingsAside,
            default: MyAccountPage,
          },
        },
        {
          path: 'profiles',
          name: 'settings_profiles',
          components: {
            aside: SettingsAside,
            default: ProfilesPage,
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
          path: 'appearance',
          name: 'settings_appearance',
          components: {
            aside: SettingsAside,
            default: AppearancePage,
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
