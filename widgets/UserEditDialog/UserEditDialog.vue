<template>
  <v-dialog v-model="dialog" max-width="600" persistent>
    <v-card>
      <v-card-title class="text-h6">Редактирование пользователя</v-card-title>

      <v-card-text>
        <v-form ref="formRef" @submit.prevent="handleSubmit">
          <v-text-field
            v-model="form.fullName"
            label="ФИО"
            :error-messages="errors.fullName"
            variant="outlined"
            required
            class="mb-4"
          />

          <v-text-field
            v-model="form.dateOfBirth"
            label="Дата рождения"
            type="date"
            :error-messages="errors.dateOfBirth"
            variant="outlined"
            required
            class="mb-4"
          />

          <v-text-field
            v-model="form.email"
            label="Email"
            type="email"
            :error-messages="errors.email"
            variant="outlined"
            required
            class="mb-4"
          />

          <v-text-field
            v-model="form.phone"
            label="Телефон"
            :error-messages="errors.phone"
            variant="outlined"
            required
            class="mb-4"
          />
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn variant="text" @click="handleCancel">Отмена</v-btn>
        <v-btn color="primary" variant="text" @click="handleSubmit"> Сохранить </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { useUserForm } from '~/shared/composables/useUserForm'
import type { User } from '~/shared/types/user'

interface Props {
  modelValue: boolean
  user: User | null
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'saved'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const usersStore = useUsersStore()
const { form, errors, validate, setFormData } = useUserForm()
const formRef = ref()

const dialog = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

watch(
  () => props.user,
  (user) => {
    if (user) {
      setFormData({
        fullName: user.fullName,
        dateOfBirth: user.dateOfBirth,
        email: user.email,
        phone: user.phone,
      })
    }
  },
  { immediate: true }
)

const handleSubmit = () => {
  if (!validate() || !props.user) {
    return
  }

  try {
    usersStore.updateUser(props.user.id, {
      fullName: form.value.fullName,
      dateOfBirth: form.value.dateOfBirth,
      email: form.value.email,
      phone: form.value.phone,
    })

    emit('saved')
    dialog.value = false
  } catch (error) {
    console.error('Error updating user:', error)
  }
}

const handleCancel = () => {
  dialog.value = false
}
</script>
