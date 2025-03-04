<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'

interface NavigationLinks {
  title: string
  name: string
}

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const { user } = storeToRefs(authStore)

const isDrawerOpen = ref<boolean>(true)
const navigationLinks = computed<NavigationLinks[]>(() => {
  const adminlinks = [
    {
      title: 'User Maintenance',
      name: 'user-maintenance',
    },
    {
      title: 'Employee Dashboard',
      name: 'employee-dashboard',
    },
  ]

  if (!user.value.roles?.includes('Admin')) {
    return adminlinks.filter((link) => link.name !== 'user-maintenance')
  }

  return adminlinks
})

const selectedNav = ref()

const menuList = ref([
  {
    title: 'Logout',
    icon: 'mdi-logout',
  },
])

const toggleDrawer = () => {
  isDrawerOpen.value = !isDrawerOpen.value
}

const routeTo = (name: string) => {
  router.push({ name })
}

const logout = async () => {
  const response = await authStore.logout()
  if (response?.status === 200) {
    routeTo('sign-in')
  }
}

onMounted(() => {
  selectedNav.value = [route.name]
})
</script>

<template>
  <v-app-bar class="px-2" :elevation="1" color="blue-grey-darken-4">
    <template v-slot:prepend>
      <div class="d-flex justify-center align-center">
        <v-app-bar-nav-icon variant="text" @click="toggleDrawer"></v-app-bar-nav-icon>
        <v-app-bar-title>CMS</v-app-bar-title>
      </div>
    </template>
    <!-- <template #append> -->
    <v-btn id="menu-activator" icon="mdi-dots-vertical" variant="text"> </v-btn>
    <v-menu activator="#menu-activator">
      <v-list width="150" density="compact">
        <v-list-item
          v-for="(item, index) in menuList"
          :key="index"
          :value="item.title"
          @click="logout"
        >
          <template #prepend>
            <v-icon :icon="item.icon"></v-icon>
          </template>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
  <v-navigation-drawer v-model="isDrawerOpen" permanent width="260" elevation="0">
    <v-list v-model:selected="selectedNav">
      <template v-for="(item, idx) in navigationLinks" :key="item.name">
        <v-list-item
          :value="item.name"
          class="ma-3"
          density="compact"
          :title="item.title"
          active-class="text-blue-grey"
          @click="routeTo(item.name)"
        ></v-list-item>
      </template>
    </v-list>
  </v-navigation-drawer>
  <v-main>
    <v-container fluid class="h-screen mx-auto px-3 py-3">
      <router-view />
    </v-container>
  </v-main>
</template>
