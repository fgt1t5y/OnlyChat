import { login, profile, received, find } from './api'

const apis = {
  auth: {
    login,
    profile,
  },
  friendRequest: {
    received,
  },
  user: {
    find,
  },
}

export default apis
