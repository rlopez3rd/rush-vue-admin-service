import { defineStore } from 'pinia'
import { ref } from 'vue'
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
      user.value = payload.user
      authorization.value = payload.authorization

      localStorage.setItem('user', JSON.stringify(user.value))
      localStorage.setItem('authorization', JSON.stringify(authorization.value))
    }

    const logout = async () => {
      user.value = {}
      authorization.value = {}

      localStorage.removeItem('user')
      localStorage.removeItem('authorization')
    }

    return { user, authorization, signIn, logout }
  },
  { persist: true },
)
