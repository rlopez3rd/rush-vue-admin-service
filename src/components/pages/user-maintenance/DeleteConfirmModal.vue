<script setup lang="ts">
import { computed, inject, ref } from 'vue'
import api from '@/api/api'

interface User {
  id: number
  firstname: string
  lastname: string
  email: string
  address: string
  phone_number: string
  postcode: string
  username: string
  password: string
}

interface Props {
  row: Partial<User>
}
const showNotification = inject<any>('showNotification')
const props = defineProps<Props>()
const emit = defineEmits(['deleteUser'])
const dialogModel = defineModel<boolean>()
const isLoading = ref<boolean>(false)

const name = computed(() => {
  return `${props.row.firstname} ${props.row.lastname}`
})

const onDelete = async () => {
  try {
    const response = await api.delete(`users/${props.row.id}`)

    showNotification(response?.data.message, 'success')
    emit('deleteUser')
  } catch (error: any) {
    showNotification(error?.response?.data.message, 'error')
  }
  dialogModel.value = false
}
</script>

<template>
  <v-dialog v-model="dialogModel" max-width="600">
    <v-card>
      <v-card-item class="bg-blue-grey-darken-4">
        <v-card-title>Confirm Delete</v-card-title>
      </v-card-item>
      <v-card-text class="pa-5">
        Are you sure you want to delete <span class="font-weight-bold">{{ name }}</span> ?
      </v-card-text>
      <v-card-actions>
        <v-row class="pa-5" justify="end">
          <v-btn class="mr-3" @click="() => (dialogModel = !dialogModel)">Close</v-btn>
          <v-btn
            class="bg-blue-grey-darken-4"
            @click="onDelete"
            :disabled="isLoading"
            :loading="isLoading"
            >Confirm</v-btn
          >
        </v-row>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
