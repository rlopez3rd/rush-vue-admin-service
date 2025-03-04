import { ref } from 'vue'

export const setLocalStorage = (key: string, data: any): void => {
  localStorage.setItem(key, JSON.stringify(data))
}

export const getLocalStorage = (key: string): any => {
  const localData = ref<any>(null)
  localData.value = localStorage.getItem(key)

  return localData.value ? JSON.parse(localData.value) : null
}

export const removeLocalStorage = (key: string): void => {
  localStorage.removeItem(key)
}
