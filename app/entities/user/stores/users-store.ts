import { defineStore } from 'pinia'
import type { User } from '~/entities/user/types/user'

export const useUsersStore = defineStore('users', () => {
  const users = ref<User[]>([
    {
      id: '1',
      fullName: 'Иванов Иван Иванович',
      dateOfBirth: '1990-05-15',
      email: 'ivanov@example.com',
      phone: '+7-999-123-45-67'
    },
    {
      id: '2',
      fullName: 'Петрова Анна Сергеевна',
      dateOfBirth: '1985-12-03',
      email: 'petrova@example.com',
      phone: '+7-999-234-56-78'
    },
    {
      id: '3',
      fullName: 'Сидоров Алексей Петрович',
      dateOfBirth: '1995-07-22',
      email: 'sidorov@example.com',
      phone: '+7-999-345-67-89'
    }
  ])

  const addUser = (userData: Omit<User, 'id'>) => {
    const newUser: User = {
      ...userData,
      id: Date.now().toString()
    }
    users.value.push(newUser)
    return newUser
  }

  const updateUser = (id: string, userData: Partial<User>) => {
    const index = users.value.findIndex(u => u.id === id)
    if (index !== -1) {
      users.value[index] = { ...users.value[index], ...userData }
      return users.value[index]
    }
    return null
  }

  const deleteUser = (id: string) => {
    const index = users.value.findIndex(u => u.id === id)
    if (index !== -1) {
      users.value.splice(index, 1)
      return true
    }
    return false
  }

  const getUserById = (id: string) => {
    return users.value.find(u => u.id === id) || null
  }

  return {
    users,
    addUser,
    updateUser,
    deleteUser,
    getUserById
  }
})
