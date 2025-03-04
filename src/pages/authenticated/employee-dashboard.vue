<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { computed, ref } from '@vue/reactivity'
import { storeToRefs } from 'pinia'

const authStore = useAuthStore()

const { user } = storeToRefs(authStore)

const breadCrumbs = ref([
  {
    title: 'Dashboard',
    to: '/',
  },
  {
    title: 'Employee Dashboard',
    to: '/employe-dashboard',
  },
])

const name = computed(() => {
  const firstname = user.value.firstname || '-'
  const lastname = user.value.lastname || '-'

  return `${firstname} ${lastname}`
})
</script>

<template>
  <v-container>
    <div class="px-3">
      <v-breadcrumbs :items="breadCrumbs" class=""></v-breadcrumbs>
      <div class="mx-4 d-flex justify-space-between">
        <div class="text-h5">Employee Dashboard</div>
      </div>
    </div>

    <v-sheet class="mx-6 my-5" rounded="sm" elevation="1">
      <div class="pa-4">Hey Employee {{ name }}!</div>
    </v-sheet>
  </v-container>
</template>
