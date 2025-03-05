<script setup lang="ts">
import { inject, reactive, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter, useRoute } from 'vue-router'

import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'

interface UserForm {
  username: string
  password: string
}
const showNotification = inject<any>('showNotification')

const router = useRouter()
const authStore = useAuthStore()

const showPassword = ref<boolean>(false)

const formData = reactive<UserForm>({
  username: '',
  password: '',
})

const rules = reactive({
  username: { required },
  password: { required },
})

const v$ = useVuelidate(rules, formData)

const handleSubmit = async (e: any) => {
  const result = await v$.value.$validate()

  if (result) {
    try {
      const response = await authStore.signIn(formData)

      const { user } = response?.data.result
      if (user.roles?.includes('Admin')) {
        if (response?.status === 200) {
          router.push({ name: 'user-maintenance' })
        }
      } else {
        router.push({ name: 'employee-dashboard' })
      }
    } catch (error: any) {
      showNotification(error?.response.data.message, 'error')
    }
  }
}
</script>

<template>
  <v-container class="h-screen d-flex justify-center align-center">
    <v-card class="mx-auto pa-5" elevation="2" min-width="448" max-width="448" rounded="lg">
      <v-card-item>
        <v-card-title>Sign In</v-card-title>
      </v-card-item>
      <v-card-text>
        <v-text-field
          class="mb-2"
          name="username"
          label="Username"
          variant="outlined"
          density="compact"
          v-model="formData.username"
          :error="v$.username.error"
          :error-messages="v$.username.$error ? v$.username.$errors[0].$message : ''"
          @keyup.enter="handleSubmit"
        />

        <v-text-field
          class="mb-2"
          name="password"
          label="Password"
          variant="outlined"
          density="compact"
          v-model="formData.password"
          :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          :type="showPassword ? 'text' : 'password'"
          @click:append-inner="showPassword = !showPassword"
          :error="v$.password.error"
          :error-messages="v$.password.$error ? v$.password.$errors[0].$message : ''"
          @keyup.enter="handleSubmit"
        />

        <v-btn class="w-100" color="blue-grey-darken-4" @click="handleSubmit"> Sign In </v-btn>
      </v-card-text>
    </v-card>
  </v-container>
</template>
