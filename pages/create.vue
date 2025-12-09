<template>
  <div class="container mx-auto px-4 py-8 max-w-2xl">
    <h1 class="text-2xl md:text-3xl font-bold mb-6">Создание пользователя</h1>

    <v-form ref="formRef" @submit.prevent="handleSubmit">
      <v-text-field v-model="form.fullName" label="ФИО" :error-messages="errors.fullName" variant="outlined" required
        class="mb-2" />

      <v-date-input v-model="form.dateOfBirth" label="Дата рождения" view-mode="year" variant="outlined"
        placeholder="дд.мм.гггг" prepend-inner-icon="$calendar" prepend-icon="" class="mb-2" :min="minDateOfBirth"
        :max="maxDateOfBirth" :error-messages="errors.dateOfBirth"></v-date-input>

      <v-text-field v-model="form.email" label="Email" type="email" :error-messages="errors.email" variant="outlined"
        required class="mb-2" />

      <v-text-field v-model="form.phone" label="Телефон" :error-messages="errors.phone" variant="outlined" required
        class="mb-2" />

      <div class="d-flex gap-4 flex-wrap">
        <v-btn type="submit" color="primary" size="large" class="flex-grow-1 flex-md-grow-0">
          Создать
        </v-btn>
        <v-btn variant="outlined" size="large" class="flex-grow-1 flex-md-grow-0" @click="handleCancel">
          Отмена
        </v-btn>
      </div>
    </v-form>

    <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000">
      {{ snackbar.message }}
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import { useUserForm } from '~/shared/composables/useUserForm'

const usersStore = useUsersStore()
const { form, errors, maxDateOfBirth, minDateOfBirth, validate, reset } = useUserForm()
const formRef = ref()

const snackbar = ref({
  show: false,
  message: '',
  color: 'success',
})

const handleSubmit = async () => {
  if (!validate()) {
    return
  }

  try {
    usersStore.addUser({
      fullName: form.value.fullName,
      dateOfBirth: form.value.dateOfBirth,
      email: form.value.email,
      phone: form.value.phone,
    })

    showSnackbar('Пользователь успешно создан', 'success')
    reset()

    // Перенаправление на главную страницу через 1 секунду
    setTimeout(() => {
      navigateTo('/')
    }, 1000)
  } catch (error) {
    showSnackbar('Ошибка при создании пользователя', error)
  }
}

const handleCancel = () => {
  navigateTo('/')
}

const showSnackbar = (message: string, color: 'success' | 'error') => {
  snackbar.value = {
    show: true,
    message,
    color,
  }
}
</script>
