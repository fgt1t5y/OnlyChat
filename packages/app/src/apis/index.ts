import { login, profile, find } from './api'

const apis = {
  auth: {
    login,
    profile,
  },
  user: {
    find
  }
}

export default apis
