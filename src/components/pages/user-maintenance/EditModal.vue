<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { inject } from 'vue'

import { useVuelidate } from '@vuelidate/core'
import { required, email, numeric, helpers, minLength, maxLength } from '@vuelidate/validators'
import { startWithNine } from '@/utils/helpers'
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
  row?: Partial<User>
}

const props = defineProps<Props>()
const emit = defineEmits(['refreshData'])
const showNotification = inject<any>('showNotification')

const dialogModel = defineModel<boolean>()

const showPassword = ref<boolean>(false)
const isLoading = ref<boolean>(false)

const formData = reactive({
  id: props.row?.id || 0,
  username: props.row?.username || '',
  password: props.row?.password || '',
  firstname: props.row?.firstname || '',
  lastname: props.row?.lastname || '',
  email: props.row?.email || '',
  address: props.row?.address || '',
  phone_number: props.row?.phone_number || '',
  postcode: props.row?.postcode || '',
})

const rules = reactive({
  firstname: { required },
  lastname: { required },
  email: { required, email },
  phone_number: {
    required,
    numeric,
    startsWithNine: helpers.withMessage(
      'Phone Number should be a 10-digit number that always starts with 9.',
      startWithNine,
    ),
    minLength: minLength(10),
    maxLength: maxLength(10),
  },
  address: { required },
  postcode: { required },
  username: { required },
})

const v$ = useVuelidate(rules, formData)

onMounted(() => {
  // formData.value = { ...props.row }
})

const onSave = async () => {
  const result = await v$.value.$validate()
  if (result) {
    try {
      isLoading.value = true
      const payload = formData

      if (!formData.password) {
        delete formData['password']
      }
      const response = await api.put(`users/${formData.id}`, payload)
      isLoading.value = false
      showNotification(response?.data.message, 'success')
      emit('refreshData')
      dialogModel.value = false
    } catch (error: any) {
      showNotification(error?.response?.data.message, 'error')
      isLoading.value = false
    }
  }
}
</script>

<template>
  <v-dialog v-model="dialogModel" max-width="600">
    <v-card>
      <v-card-item class="bg-blue-grey-darken-4">
        <v-card-title>Edit User</v-card-title>
      </v-card-item>
      <v-card-text class="pa-5">
        <v-row>
          <v-col cols="6">
            <v-text-field
              v-model="formData.firstname"
              name="firstname"
              label="First Name"
              density="compact"
              variant="outlined"
              :error="v$.firstname.error"
              :error-messages="v$.firstname.$error ? v$.firstname.$errors[0].$message : ''"
            />
          </v-col>
          <v-col cols="6">
            <v-text-field
              v-model="formData.lastname"
              name="lastname"
              label="Last Name"
              density="compact"
              variant="outlined"
              :error="v$.lastname.error"
              :error-messages="v$.lastname.$error ? v$.lastname.$errors[0].$message : ''"
            />
          </v-col>
          <v-col cols="6">
            <v-text-field
              v-model="formData.email"
              name="email"
              label="Email"
              density="compact"
              variant="outlined"
              :error="v$.email.error"
              :error-messages="v$.email.$error ? v$.email.$errors[0].$message : ''"
            />
          </v-col>

          <v-col cols="6">
            <v-text-field
              v-model="formData.phone_number"
              name="phone_number"
              label="Phone Number"
              density="compact"
              variant="outlined"
              :error="v$.phone_number.error"
              :error-messages="v$.phone_number.$error ? v$.phone_number.$errors[0].$message : ''"
            />
          </v-col>
          <v-col cols="6">
            <v-text-field
              v-model="formData.postcode"
              name="postcode"
              label="Postcode"
              density="compact"
              variant="outlined"
              :error="v$.postcode.error"
              :error-messages="v$.postcode.$error ? v$.postcode.$errors[0].$message : ''"
            />
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="formData.address"
              name="address"
              label="Address"
              density="compact"
              variant="outlined"
              :error="v$.address.error"
              :error-messages="v$.address.$error ? v$.address.$errors[0].$message : ''"
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="6">
            <v-text-field
              v-model="formData.username"
              name="username"
              label="Username"
              density="compact"
              variant="outlined"
              :error="v$.username.error"
              :error-messages="v$.username.$error ? v$.username.$errors[0].$message : ''"
            />
          </v-col>
          <v-col cols="6">
            <v-text-field
              v-model="formData.password"
              name="password"
              label="Password"
              density="compact"
              variant="outlined"
              :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              :type="showPassword ? 'text' : 'password'"
              @click:append-inner="showPassword = !showPassword"
            />
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <div class="py-2 px-3 d-flex justify-end ga-2">
          <v-btn @click="() => (dialogModel = false)">Close</v-btn>
          <v-btn
            class="bg-blue-grey-darken-4"
            @click="onSave"
            :disabled="isLoading"
            :loading="isLoading"
            >Save</v-btn
          >
        </div>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
