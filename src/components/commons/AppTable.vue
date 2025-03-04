<script setup lang="ts">
import { computed, ref, watch } from 'vue'

interface TableColumn {
  field: string
  title: string
}

interface Pagination {
  page: number
  from?: number
  to?: number
  total?: number
  per_page?: Number
  last_page?: number
  perPageList?: number[]
}

interface TableProps {
  columns: TableColumn[]
  rows: Record<string, any>[]
  showPagination?: boolean
}

const props = withDefaults(defineProps<TableProps>(), {
  rows: () => [],
})

const emit = defineEmits(['update:selectedRows'])

const pagination = defineModel<Partial<Pagination> | any>('pagination')

const computedPagination = computed(() => pagination.value)

const showPagination = computed(() => !!pagination.value)

const paginationRange = computed(() => {
  const { to, from, total } = computedPagination.value

  if (from == null && to == null) {
    return `0-0 of ${total}`
  } else {
    return `${from}-${to} of ${total}`
  }
})

const selectedRows = defineModel<Record<string, any>[]>('selectedRows', { default: [] })

// const selectedRows = ref<Record<string, any>[]>([])

// const allSelected = computed({
//   get: () => props.rows.length > 0 && selectedRows.value!.length === props.rows.length,
//   set: (value) => {
//     selectedRows.value = value ? [...props.rows] : []
//   },
// })

const allSelected = ref<boolean>()

watch(allSelected, (to) => {
  if (!to) {
    selectedRows.value = []
  } else {
    selectedRows.value = [...props.rows]
  }
})

// watch(
//   () => props.rows,
//   (to) => {
//     allSelected.value = false
//   },
//   { deep: true },
// )
</script>

<template>
  <v-sheet elevation="1">
    <v-table density="compact" class="pa-3 custom-table">
      <thead>
        <tr>
          <th>
            <v-checkbox v-model="allSelected" density="compact" hide-details></v-checkbox>
          </th>
          <th v-for="(column, index) in columns" :key="column.field">
            <span class="font-weight-bold">{{ column?.title }}</span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, index) in props.rows" :key="index">
          <td>
            <v-checkbox
              v-model="selectedRows"
              :value="row"
              density="compact"
              hide-details
            ></v-checkbox>
          </td>
          <td v-for="column in props.columns" :key="column.field" class="py-5">
            <template v-if="column.field === 'actions'">
              <slot name="actionMenu" :row="row"></slot>
            </template>
            <template v-else>
              {{ row[column.field] || '-' }}
            </template>
          </td>
        </tr>
        <tr v-if="!props.rows.length">
          <td :colspan="props.columns.length" class="pa-5 text-center">No data available</td>
        </tr>
      </tbody>
    </v-table>

    <div v-if="showPagination" class="pa-3 d-flex justify-end">
      <div class="d-flex justify-end">
        <div class="mr-5 d-flex align-center ga-4">
          <div class="">Row per page</div>
          <v-select
            v-model="pagination!.per_page"
            :items="computedPagination!.perPageList"
            variant="outlined"
            density="compact"
            hide-details
          ></v-select>
          <span class="">{{ paginationRange }}</span>
        </div>
        <v-pagination
          v-model="pagination!.page"
          :length="computedPagination!.last_page"
          density="compact"
          :total-visible="6"
          :disabled="computedPagination!.total == 1"
        ></v-pagination>
      </div>
    </div>
  </v-sheet>
</template>

<style scoped>
.custom-table {
  overflow-x: auto;
}
</style>
