import { ref } from 'vue'
import { useCookies } from 'vue3-cookies'

const { cookies } = useCookies()

export const getCookie = (key: string): any => {
  const cookieData = ref<any>(null)
  cookieData.value = cookies.get(key)

  return cookieData.value ? cookieData.value : null
}

export const setCookie = (key: string, data: any): void => {
  cookies.set(key, JSON.stringify(data))
}

export const removeCookie = (key: string): void => {
  cookies.remove(key)
}
