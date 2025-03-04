<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter, useRoute } from 'vue-router'

interface UserForm {
  username: string
  password: string
}

const router = useRouter()
const authStore = useAuthStore()

const showPassword = ref<boolean>(false)

const formData = reactive<UserForm>({
  username: '',
  password: '',
})

const handleSubmit = async () => {
  const response = await authStore.signIn(formData)

  if (response?.status === 200) {
    router.push({ name: 'user-maintenance' })
  }
}
</script>

<template>
  <v-container class="h-screen d-flex justify-center align-center">
    <v-card class="mx-auto pa-12 pb-8" elevation="2" min-width="448" max-width="448" rounded="lg">
      <v-card-item>
        <v-card-title>Sign In</v-card-title>
      </v-card-item>
      <v-card-text>
        <v-text-field
          name="username"
          label="Username"
          variant="outlined"
          density="compact"
          v-model="formData.username"
        />

        <v-text-field
          name="password"
          label="Password"
          variant="outlined"
          density="compact"
          v-model="formData.password"
          :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          :type="showPassword ? 'text' : 'password'"
          @click:append-inner="showPassword = !showPassword"
        />

        <v-btn class="w-100" color="blue-grey-darken-4" @click="handleSubmit"> Sign In </v-btn>
      </v-card-text>
    </v-card>
  </v-container>
</template>
