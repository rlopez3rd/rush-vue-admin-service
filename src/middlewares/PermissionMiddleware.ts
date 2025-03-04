import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

export default (to: any, from: any, next: any) => {
  const router = useRouter()
  const authStore = useAuthStore()
  const { user } = storeToRefs(authStore)

  if (!user) {
    router.push({ name: 'landing' })
  }
  next()
}
