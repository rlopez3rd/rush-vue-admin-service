<script setup lang="ts">
import { ref, provide } from 'vue'

interface Notification {
  message: string
  type: 'success' | 'error' | 'info' | 'warning'
}

const notification = ref<Notification | null>(null)
const snackbar = ref(false)

const showNotification = (message: string, type: Notification['type'] = 'info') => {
  notification.value = { message, type }
  snackbar.value = true
}

provide('showNotification', showNotification)
</script>

<template>
  <div>
    <slot></slot>

    <v-snackbar
      v-model="snackbar"
      timeout="3000"
      location="bottom right"
      outlined
      :color="notification?.type"
    >
      <v-icon
        icon="mdi mdi-check-circle"
        size="x-small"
        class="mr-1"
        v-if="notification?.type == 'success'"
      ></v-icon>
      <v-icon
        icon="mdi mdi-circle-xmark"
        size="x-small"
        class="mr-1"
        v-if="notification?.type == 'error'"
      ></v-icon>
      {{ notification?.message }}
    </v-snackbar>
  </div>
</template>
