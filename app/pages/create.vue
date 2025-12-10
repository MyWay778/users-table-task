<script setup lang="ts">
  import { useUserForm } from '@/shared/composables/useUserForm'
  import { PhoneInput } from '@/shared/ui'

  const ROUTE_HOME = '/'
  const SNACKBAR_TIMEOUT = 3000
  const REDIRECT_DELAY = 1000

  const usersStore = useUsersStore()
  const { form, errors, maxDateOfBirth, minDateOfBirth, validate, reset } = useUserForm()

  const snackbar = ref({
    show: false,
    message: '',
    color: 'success'
  })

  const isLoading = ref(false)

  const handleSubmit = async () => {
    if (!validate()) return

    isLoading.value = true
    try {
      usersStore.addUser({
        fullName: form.value.fullName,
        dateOfBirth: form.value.dateOfBirth,
        email: form.value.email,
        phone: form.value.phone
      })

      showSnackbar('Пользователь успешно создан', 'success')
      reset()

      // Перенаправление на главную страницу через 1 секунду
      setTimeout(() => {
        navigateTo(ROUTE_HOME)
      }, REDIRECT_DELAY)
    } catch (error) {
      console.warn('Error creating user:', error)
      showSnackbar(error instanceof Error ? error.message : 'Неизвестная ошибка', 'error')
    } finally {
      isLoading.value = false
    }
  }

  const handleCancel = () => {
    if (form.value.fullName || form.value.email || form.value.phone) {
      if (confirm('У вас есть несохранённые изменения. Вы уверены, что хотите покинуть страницу?')) {
        navigateTo(ROUTE_HOME)
      }
    } else {
      navigateTo(ROUTE_HOME)
    }
  }

  const showSnackbar = (message: string, color: 'success' | 'error') => {
    snackbar.value = {
      show: true,
      message,
      color
    }
  }
</script>

<template>
  <div class="container mx-auto px-4 py-8 max-w-2xl">
    <h1 class="text-2xl md:text-3xl font-bold mb-6">Создание пользователя</h1>

    <v-form
      ref="formRef"
      class="flex flex-col gap-2"
      @submit.prevent="handleSubmit">
      <!-- Full name -->
      <v-text-field
        v-model="form.fullName"
        label="ФИО"
        :error-messages="errors.fullName"
        variant="outlined"
        required />

      <!-- Birthday -->
      <v-date-input
        v-model="form.dateOfBirth"
        label="Дата рождения"
        view-mode="year"
        variant="outlined"
        placeholder="дд.мм.гггг"
        prepend-inner-icon="$calendar"
        prepend-icon=""
        :min="minDateOfBirth"
        :max="maxDateOfBirth"
        :error-messages="errors.dateOfBirth" />

      <!-- Email -->
      <v-text-field
        v-model="form.email"
        label="Email"
        type="email"
        :error-messages="errors.email"
        variant="outlined"
        required />

      <!-- Phone -->
      <PhoneInput
        v-model="form.phone"
        value-mask="+7-###-###-##-##"
        :error-messages="errors.phone" />

      <div class="mt-4 flex gap-4 flex-wrap justify-between">
        <v-btn
          variant="outlined"
          size="large"
          class="w-full sm:w-auto grow md:grow-0"
          :disabled="isLoading"
          @click="handleCancel">
          Отмена
        </v-btn>

        <v-btn
          type="submit"
          color="primary"
          variant="flat"
          size="large"
          :loading="isLoading"
          class="w-full sm:w-auto grow md:grow-0">
          Создать
        </v-btn>
      </div>
    </v-form>

    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="SNACKBAR_TIMEOUT">
      {{ snackbar.message }}
    </v-snackbar>
  </div>
</template>
