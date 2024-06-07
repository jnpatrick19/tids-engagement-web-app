import { setUserRole } from './components/Roles/Roles'
import axios from 'axios'
import api from './api.json'

const API_ROOT = api.ROOT
const REDIRECT_LINK = api.REDIRECT_LINK

export default function GoogleLogin() {
  axios.get(API_ROOT + '/google/auth').then((response) => (window.location.href = response.data))
  return null
}

export function Redirect() {
  Login()
  setTimeout(() => window.location.replace(REDIRECT_LINK), 2000)
  return null
}

async function Login() {
  const authDetails = window.location.search.slice(1).split('&')
  const code = authDetails[0].slice(5)
  const scope = authDetails[1].slice(6)
  const authUser = authDetails[2].slice(9)
  const hd = authDetails[3].slice(3)
  const prompt = authDetails[4].slice(7)
  const tokens = await axios.get(API_ROOT + '/google/redirect', {
    params: { code: code, scope: scope, authUser: authUser, hd: hd, prompt: prompt },
  })
  const userInfo = await axios.post(API_ROOT + '/google/getUserInfo', tokens.data).then((res) => {
    return res.data
  })
  setLoginDetails(userInfo)
}

function setLoginDetails(userInfo: any) {
  const loginDate = new Date().toLocaleDateString()
  window.localStorage.setItem('sessDate', loginDate)
  window.localStorage.setItem('email', userInfo.email)
  window.localStorage.setItem('familyName', userInfo.family_name)
  window.localStorage.setItem('givenName', userInfo.given_name)
}

// Uncomment for PROD build
// window.addEventListener('storage', () => { setUserRole() })