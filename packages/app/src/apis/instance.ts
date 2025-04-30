import { createAlova } from 'alova'
import adapterFetch from 'alova/fetch'
import VueHook from 'alova/vue'

export const alovaInstance = createAlova({
  baseURL: '/api',
  timeout: 10000,
  requestAdapter: adapterFetch(),
  statesHook: VueHook,
  beforeRequest(method) {
    if (localStorage.getItem('token')) {
      method.config.headers.Authorization = localStorage.getItem('token')
    }
  },
  responded: {
    onSuccess: async (response) => {
      if (response.status === 204) {
        return
      }

      const json = await response.json()

      if (json.statusCode >= 400) {
        console.error('[OC]', json.message)

        throw new Error(json.message)
      }

      return json
    },
  },
})
