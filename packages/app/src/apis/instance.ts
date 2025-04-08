import type { IResponse } from '@/types'
import { createAlova } from 'alova'
import adapterFetch from 'alova/fetch'
import VueHook from 'alova/vue'

export const alovaInstance = createAlova({
  baseURL: '/api',
  timeout: 10000,
  requestAdapter: adapterFetch(),
  statesHook: VueHook,
  responded: {
    onSuccess: async (response, method) => {
      const json = (await response.json()) as IResponse<unknown>

      if (!json.success) {
        throw new Error(json.message)
      }

      return json.data
    },
  },
})
