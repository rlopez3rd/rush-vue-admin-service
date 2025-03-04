import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()

const instance = axios.create({
  baseURL: import.meta.env.VITE_ADMIN_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

instance.interceptors.request.use((request) => {
  const token = localStorage.getItem('authorization') || null
  request.headers['Authorization'] = token ? `Bearer ${JSON.parse(token).access_token}` : ''
  request.headers['Access-Control-Allow-Origin'] = '*'
  request.headers['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept'
  request.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'

  return request
})

instance.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    console.log(error.response.status)
    let status = error.response.status
    if (status === 401 || status === 403) {
      localStorage.removeItem('user')
      localStorage.removeItem('authorization')
      window.location.pathname = '/sign-in'
    }
    return Promise.reject(error)
  },
)

export default instance
