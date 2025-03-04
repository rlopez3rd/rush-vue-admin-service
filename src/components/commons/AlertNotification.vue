<template>
  <v-snackbar
    :timeout="timeout"
    v-model="show"
    sticky
    bottom
    :color="alertType"
    outlined
    location="bottom right"
  >
    <v-icon
      icon="mdi mdi-check-circle"
      size="x-small"
      class="mr-1"
      v-if="alertType == 'success'"
    ></v-icon>
    <v-icon
      icon="mdi mdi-circle-xmark"
      size="x-small"
      class="mr-1"
      v-if="alertType == 'error'"
    ></v-icon>
    {{ message }}
  </v-snackbar>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import eventBus from '@/utils/eventBus'

const message = ref('')
const alertType = ref('success')
const timeout = ref(3000)
const show = ref(false)

onMounted(() => {
  eventBus.on('alert-notification', (e) => {
    message.value = e.message
    alertType.value = e.alertType
    timeout.value = e.timeout
    show.value = e.show
  })
})
</script>

<style></style>
