import type { UserFormData } from '~/shared/types/user'
import { useDate } from 'vuetify'

export const useUserForm = () => {
  const form = ref<UserFormData>({
    fullName: '',
    dateOfBirth: '',
    email: '',
    phone: '',
  })

  // Расчет максимальной и минимальной даты рождения
  const vuetifyDate = useDate()
  const today = new Date()
  const maxDateOfBirth = vuetifyDate.setYear(today, vuetifyDate.getYear(today) - 18)
  const minDateOfBirth = vuetifyDate.setYear(today, vuetifyDate.getYear(today) - 100)

  const errors = ref<Partial<Record<keyof UserFormData, string>>>({})

  const validate = (): boolean => {
    errors.value = {}

    if (!form.value.fullName.trim()) {
      errors.value.fullName = 'ФИО обязательно для заполнения'
    }

    if (!form.value.dateOfBirth) {
      errors.value.dateOfBirth = 'Дата рождения обязательна для заполнения'
    } else {
      const date = new Date(form.value.dateOfBirth)
      if (isNaN(date.getTime())) {
        errors.value.dateOfBirth = 'Некорректная дата'
      } else {
        // Проверка минимального возраста (не менее 18 лет)
        if (date > maxDateOfBirth) {
          errors.value.dateOfBirth = 'Возраст должен быть не менее 18 лет'
        }
        // Проверка максимального возраста (не более 100 лет)
        if (date < minDateOfBirth) {
          errors.value.dateOfBirth = 'Возраст должен быть не более 100 лет'
        }
      }
    }

    if (!form.value.email.trim()) {
      errors.value.email = 'Email обязателен для заполнения'
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(form.value.email)) {
        errors.value.email = 'Некорректный формат email'
      }
    }

    if (!form.value.phone.trim()) {
      errors.value.phone = 'Телефон обязателен для заполнения'
    } else {
      const phoneRegex = /^\+?[0-9-()]+$/
      if (!phoneRegex.test(form.value.phone)) {
        errors.value.phone = 'Некорректный формат телефона'
      }
    }

    return Object.keys(errors.value).length === 0
  }

  const reset = () => {
    form.value = {
      fullName: '',
      dateOfBirth: '',
      email: '',
      phone: '',
    }
    errors.value = {}
  }

  const setFormData = (data: UserFormData) => {
    form.value = { ...data }
    errors.value = {}
  }

  return {
    form,
    errors,
    maxDateOfBirth,
    minDateOfBirth,
    validate,
    reset,
    setFormData,
  }
}
