import { createRouter, createWebHistory } from 'vue-router'
// Auth page
import AuthView from '@/views/AuthView.vue'
// Root layouts
import MainView from '@/views/MainView.vue'
// Aside
import HomeAside from '@/views/aside/HomeAside.vue'
import ServerAside from '@/views/aside/ServerAside.vue'
import SettingsAside from '@/views/aside/SettingsAside.vue'
// Home pages
import FriendsPage from '@/views/page/home/FriendsPage.vue'
import FriendRequestsPage from '@/views/page/home/FriendRequestsPage.vue'
import AddFriendPage from '@/views/page/home/AddFriendPage.vue'
import DMChatPage from '@/views/page/home/DMChatPage.vue'
// Settings pages
import ProfilesPage from '@/views/page/settings/ProfilesPage.vue'
import MyAccountPage from '@/views/page/settings/MyAccountPage.vue'
import AppearancePage from '@/views/page/settings/AppearancePage.vue'
import LogoutPage from '@/views/page/settings/LogoutPage.vue'
// Server pages
import ServerChannelsPage from '@/views/page/server/ServerChannelsPage.vue'
import ServerMembersPage from '@/views/page/server/ServerMembersPage.vue'
import ServerChannelChatPage from '@/views/page/server/ServerChannelChatPage.vue'

import type { Component } from 'vue'
import type { RouteRecordRaw } from 'vue-router'

type PathPageMap = Record<string, Component>

const settingsPages: PathPageMap = {
  my_account: MyAccountPage,
  profiles: ProfilesPage,
  appearance: AppearancePage,
  logout: LogoutPage,
}

const settings = (): RouteRecordRaw[] => {
  const routes: RouteRecordRaw[] = [
    {
      path: '',
      name: 'settings',
      redirect() {
        return { name: 'settings_my_account' }
      },
    },
  ]

  Object.keys(settingsPages).forEach((item) => {
    routes.push({
      path: item,
      name: `settings_${item}`,
      components: {
        aside: SettingsAside,
        default: settingsPages[item],
      },
    })
  })

  return routes
}

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
          name: 'add_friend',
          components: {
            aside: HomeAside,
            default: AddFriendPage,
          },
        },
        {
          path: 'dm/:dmSessionId(\\d+)',
          name: 'dm_chat',
          components: {
            aside: HomeAside,
            default: DMChatPage,
          },
        },
        {
          path: 'dm/:dmSessionId(\\d+)/:dmMessageId(\\d+)',
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
            aside: ServerAside,
            default: ServerChannelsPage,
          },
        },
        {
          path: 'members',
          name: 'server_members',
          components: {
            aside: ServerAside,
            default: ServerMembersPage,
          },
        },
        {
          path: ':channelId(\\d+)',
          name: 'server_channel_chat',
          components: {
            aside: ServerAside,
            default: ServerChannelChatPage,
          },
        },
      ],
    },
    {
      path: '/settings',
      component: MainView,
      children: settings(),
    },
    {
      path: '/login',
      name: 'login',
      component: AuthView,
    },
  ],
})

export default router
