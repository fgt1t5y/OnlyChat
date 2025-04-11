import { login, profile, sendRequest, getReceived, getSent, find } from './api'

const apis = {
  auth: {
    login,
    profile,
  },
  friendRequest: {
    sendRequest,
    getReceived,
    getSent,
  },
  user: {
    find,
  },
}

export default apis
