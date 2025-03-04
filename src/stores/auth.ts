import { defineStore } from 'pinia'
import { onMounted, ref } from 'vue'

import api from '../api/api'

interface AuthenticatedUser {
  id: number
  username: string
  firstname: string
  lastname: string
  email: string
  address: string
  phone_number: string
  postcode: string
  roles: string[]
}

interface Authorization {
  access_token: string
  type: string
}

export const useAuthStore = defineStore(
  'auth',
  () => {
    const user = ref<Partial<AuthenticatedUser>>({})
    const authorization = ref<Partial<Authorization>>({})

    const signIn = async (payload: any) => {
      try {
        const response = await api.post('/auth/sign-in', payload)

        if (response.status === 200) {
          user.value = response.data.result.user
          authorization.value = response.data.result.authorization

          localStorage.setItem('user', JSON.stringify(user.value))
          localStorage.setItem('authorization', JSON.stringify(authorization.value))
        }

        return response
      } catch (e) {
        console.log(e)
      }
    }

    const logout = async () => {
      try {
        const response = await api.get('/auth/logout')
        if (response.status === 200) {
          user.value = {}
          authorization.value = {}

          localStorage.removeItem('user')
          localStorage.removeItem('authorization')
        }
        return response
      } catch (e) {
        console.log(e)
      }
    }

    return { user, authorization, signIn, logout }
  },
  { persist: true },
)
