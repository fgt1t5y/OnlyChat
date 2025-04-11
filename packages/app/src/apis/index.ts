import { login, profile, sendRequest, getReceived, find } from './api'

const apis = {
  auth: {
    login,
    profile,
  },
  friendRequest: {
    sendRequest,
    getReceived,
  },
  user: {
    find,
  },
}

export default apis
