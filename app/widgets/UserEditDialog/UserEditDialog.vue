<template>
  <v-dialog
    v-model="model"
    max-width="600"
    persistent>
    <v-card>
      <v-card-item>
        <v-card-title class="text-lg font-semibold p-8">Редактирование пользователя</v-card-title>
      </v-card-item>

      <v-card-text class="mt-6">
        <v-form
          ref="formRef"
          @submit.prevent="handleSubmit">
          <v-text-field
            v-model="form.fullName"
            label="ФИО"
            :error-messages="errors.fullName"
            variant="outlined"
            required
            class="mb-4" />

          <v-date-input
            v-model="form.dateOfBirth"
            label="Дата рождения"
            view-mode="month"
            variant="outlined"
            placeholder="дд.мм.гггг"
            prepend-inner-icon="$calendar"
            prepend-icon=""
            :min="minDateOfBirth"
            :max="maxDateOfBirth"
            :error-messages="errors.dateOfBirth" />

          <v-text-field
            v-model="form.email"
            label="Email"
            type="email"
            :error-messages="errors.email"
            variant="outlined"
            required
            class="mb-4" />

          <PhoneInput
            v-model="form.phone"
            value-mask="+7-###-###-##-##"
            :error-messages="errors.phone" />
        </v-form>
      </v-card-text>

      <v-card-actions class="px-6! py-4!">
        <v-btn
          variant="outlined"
          class="mr-auto"
          @click="handleCancel"
          >Отмена</v-btn
        >
        <v-btn
          color="primary"
          variant="flat"
          @click="handleSubmit">
          Сохранить
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
  import { useUserForm } from '@/shared/composables'
  import type { User } from '@/shared/types/user'
  import { PhoneInput } from '@/shared/ui'

  const model = defineModel<boolean>()
  const props = defineProps<{ user: User | null }>()
  const emit = defineEmits<{
    saved: []
  }>()

  const usersStore = useUsersStore()
  const { form, errors, maxDateOfBirth, minDateOfBirth, validate, setFormData } = useUserForm()

  watch(
    () => props.user,
    user => {
      if (user) {
        setFormData({
          fullName: user.fullName,
          dateOfBirth: user.dateOfBirth,
          email: user.email,
          phone: user.phone
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
        phone: form.value.phone
      })

      emit('saved')
      model.value = false
    } catch (error) {
      console.error('Error updating user:', error)
    }
  }

  const handleCancel = () => {
    model.value = false
  }
</script>
