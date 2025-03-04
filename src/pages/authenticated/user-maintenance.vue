<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import api from '@/api/api'
import { inject } from 'vue'
import AppTable from '@/components/commons/AppTable.vue'
import { debounce } from '@/utils/helpers'
import EditModal from '@/components/pages/user-maintenance/EditModal.vue'
import CreateModal from '@/components/pages/user-maintenance/CreateModal.vue'
import DeleteConfirmModal from '@/components/pages/user-maintenance/DeleteConfirmModal.vue'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'

interface User {
  id?: number
  firstname: string
  lastname: string
  email: string
  address: string
  phone_number: string
  postcode: string
  username: string
  password?: string
}

interface Pagination {
  page: number
  from: number
  to: number
  total: number
  per_page: Number
  last_page: number
  perPageList: number[]
}

interface UserModal {
  user: Partial<User>
  open: boolean
}

const showNotification = inject<any>('showNotification')

const authStore = useAuthStore()

const { user } = storeToRefs(authStore)

const breadCrumbs = ref([
  {
    title: 'Dashboard',
    to: '/',
  },
  {
    title: 'User Maintenance',
    to: '/user-maintenance',
  },
])

const tableColumns = ref([
  {
    field: 'firstname',
    title: 'First Name',
  },
  {
    field: 'lastname',
    title: 'Last Name',
  },
  {
    field: 'email',
    title: 'Email',
  },
  {
    field: 'address',
    title: 'Address',
  },
  {
    field: 'postcode',
    title: 'Postcode',
  },
  {
    field: 'actions',
    title: 'Actions',
  },
])

const pagination = ref<Pagination>({
  page: 1,
  from: 0,
  to: 0,
  total: 0,
  per_page: 5,
  last_page: 1,
  perPageList: [5, 10, 25, 50],
})

const createDialog = ref<UserModal>({
  user: {},
  open: false,
})

const editDialog = ref<UserModal>({
  user: {},
  open: false,
})

const deleteDialog = ref<UserModal>({
  user: {},
  open: false,
})

const search = ref<string>('')
const userData = ref<User[]>([])
const selectedUsers = ref<User[]>([])

const filterPayload = computed(() => {
  const payload: Record<string, any> = {
    page: pagination.value.page,
    per_page: pagination.value.per_page,
    ...(search.value.length > 0 ? { search: search.value } : {}),
  }

  return payload
})

const getData = async () => {
  const response = await api.get('/users', { params: filterPayload.value })

  if (response.status === 200) {
    userData.value = response.data.result.data

    const { current_page: page, from, to, total, last_page, per_page } = response.data.result.meta

    pagination.value = {
      ...pagination.value,
      page,
      from,
      to,
      total,
      per_page,
      last_page,
    }
  }
}

const debounceSearch = debounce(() => {
  // selectedUsers.value = []
  pagination.value.page = 1
  getData()
}, 300)

const handleCreate = (row: any) => {
  createDialog.value.user = { ...row }
  createDialog.value.open = true
}

const handleEdit = (row: any) => {
  editDialog.value.user = { ...row }
  editDialog.value.open = true
}

const handleDelete = async (row: any) => {
  deleteDialog.value.user = { ...row }
  deleteDialog.value.open = true
}

const deleteUser = async () => {
  pagination.value.page = 1
  getData()
}

const deleteUsers = async () => {
  const userIds = selectedUsers.value.flatMap((item) => item.id)

  const authUser = userIds.find((id) => id === user.value.id)

  if (authUser) {
    return showNotification('Deleting own account is forbidden.', 'error')
  }

  try {
    const response = await api.post(`users/delete-many`, { user_ids: userIds })

    showNotification(response?.data.message, 'success')
    selectedUsers.value = []
    pagination.value.page = 1
    getData()
  } catch (error: any) {
    showNotification(error?.response?.data.message, 'error')
  }
}

onMounted(() => {
  getData()
})

watch(
  () => pagination.value.page,
  (to, from) => {
    getData()
  },
)

watch(
  () => pagination.value.per_page,
  (to, from) => {
    if (to !== 1) {
      pagination.value.page = 1
      // return
    }
    getData()
  },
)
</script>

<template>
  <div class="px-3">
    <div>
      <v-breadcrumbs :items="breadCrumbs" class=""></v-breadcrumbs>
      <div class="mx-4 d-flex justify-space-between">
        <div class="text-h5">User Maintenance</div>
        <div>
          <v-btn
            class="mr-5"
            :color="selectedUsers.length === 0 ? 'grey' : 'red-accent-4'"
            @click="deleteUsers"
            :disabled="selectedUsers.length === 0"
            >Delete Users</v-btn
          >
          <v-btn color="blue-grey-darken-4" @click="handleCreate">Add User</v-btn>
        </div>
      </div>
    </div>

    <v-sheet class="mx-4" rounded="sm" elevation="1">
      <v-row class="my-3 px-4 py-3">
        <v-col cols="4">
          <v-text-field
            v-model="search"
            @update:model-value="debounceSearch"
            name="search"
            label="Search"
            density="compact"
            variant="outlined"
            hide-details
          />
        </v-col>
        <v-col class="d-flex justify-end" offset="4" cols="4"> </v-col>
      </v-row>
    </v-sheet>
    <div class="mx-4 my-5">
      <AppTable
        :columns="tableColumns"
        :rows="userData"
        v-model:pagination="pagination"
        v-model:selected-rows="selectedUsers"
      >
        <template #actionMenu="{ row }">
          <v-menu>
            <template v-slot:activator="{ props }">
              <v-btn icon="mdi-dots-vertical" variant="text" v-bind="props"></v-btn>
            </template>
            <v-list>
              <v-list-item @click="handleEdit(row)">
                <v-list-item-title>
                  <v-icon class="mr-2">mdi-pencil</v-icon> Edit
                </v-list-item-title>
              </v-list-item>
              <v-list-item :disabled="user.id === row.id" @click="handleDelete(row)">
                <v-list-item-title>
                  <v-icon class="mr-2">mdi-delete</v-icon> Delete
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </template>
      </AppTable>
    </div>
    <template v-if="createDialog.open">
      <CreateModal v-model="createDialog.open" @refresh-data="getData" />
    </template>
    <template v-if="editDialog.open">
      <EditModal v-model="editDialog.open" :row="editDialog.user" @refresh-data="getData" />
    </template>

    <template v-if="deleteDialog.open">
      <DeleteConfirmModal
        v-model="deleteDialog.open"
        :row="deleteDialog.user"
        @delete-user="deleteUser"
      />
    </template>
  </div>
</template>
