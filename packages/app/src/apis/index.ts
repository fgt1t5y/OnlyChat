import { login, getProfile, sendRequest, getReceived, getSent, findUser } from './api'

const apis = {
  auth: {
    login,
    getProfile,
  },
  friendRequest: {
    sendRequest,
    getReceived,
    getSent,
  },
  user: {
    findUser,
  },
}

export default apis
