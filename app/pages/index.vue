<script setup lang="ts">
  import type { User } from '~/shared/types/user'
  import UserEditDialog from '~/widgets/UserEditDialog/UserEditDialog.vue'

  const usersStore = useUsersStore()
  const search = ref('')
  const itemsPerPage = ref(10)
  const editDialog = ref(false)
  const deleteDialog = ref(false)
  const selectedUser = ref<User | null>(null)

  const snackbar = ref({
    show: false,
    message: '',
    color: 'success'
  })

  const headers = [
    { title: 'ФИО', key: 'fullName', sortable: true },
    { title: 'Дата рождения', key: 'dateOfBirth', sortable: true },
    { title: 'Email', key: 'email', sortable: false },
    { title: 'Телефон', key: 'phone', sortable: false },
    { title: 'Действия', key: 'actions', sortable: false, width: '120px' }
  ]

  const filteredUsers = computed(() => {
    if (!search.value) {
      return usersStore.users
    }

    const searchLower = search.value.toLowerCase()
    return usersStore.users.filter(user => {
      return (
        user.fullName.toLowerCase().includes(searchLower) ||
        user.dateOfBirth.includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower) ||
        user.phone.includes(searchLower)
      )
    })
  })

  const openEditDialog = (user: User) => {
    selectedUser.value = user
    editDialog.value = true
  }

  const openDeleteDialog = (user: User) => {
    selectedUser.value = user
    deleteDialog.value = true
  }

  const confirmDelete = () => {
    if (selectedUser.value) {
      const success = usersStore.deleteUser(selectedUser.value.id)
      if (success) {
        showSnackbar('Пользователь успешно удален', 'success')
      } else {
        showSnackbar('Ошибка при удалении пользователя', 'error')
      }
      deleteDialog.value = false
      selectedUser.value = null
    }
  }

  const handleUserSaved = () => {
    showSnackbar('Пользователь успешно обновлен', 'success')
    editDialog.value = false
    selectedUser.value = null
  }

  const showSnackbar = (message: string, color: 'success' | 'error') => {
    snackbar.value = {
      show: true,
      message,
      color
    }
  }

  const formatDate = (dateString: string): string => {
    if (!dateString) return ''
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return dateString

    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1) // без leading zero для месяца
    const year = date.getFullYear()

    return `${day}.${month}.${year}`
  }
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div class="mb-6 flex justify-between items-center flex-wrap gap-4">
      <h1 class="text-2xl md:text-3xl font-bold">Список пользователей</h1>
      <v-btn
        color="primary"
        to="/create"
        prepend-icon="mdi-plus"
        variant="flat"
        class="shrink-0">
        Создать пользователя
      </v-btn>
    </div>
    <div class="mb-6">
      <v-text-field
        v-model="search"
        label="Поиск"
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        density="compact"
        class="mb-4"
        clearable />
    </div>

    <v-data-table
      :headers="headers"
      :items="filteredUsers"
      :items-per-page="itemsPerPage"
      :items-per-page-options="[10, 25, 50, 100]"
      class="shadow-sm data-table-custom"
      @update:items-per-page="itemsPerPage = $event">
      <template #item.dateOfBirth="{ value }">
        {{ formatDate(value) }}
      </template>
      <template #item.actions="{ item }">
        <div class="flex gap-2">
          <v-btn
            icon="mdi-pencil"
            size="small"
            variant="text"
            @click="openEditDialog(item)" />
          <v-btn
            icon="mdi-delete"
            size="small"
            variant="text"
            color="error"
            @click="openDeleteDialog(item)" />
        </div>
      </template>
    </v-data-table>

    <UserEditDialog
      v-model="editDialog"
      :user="selectedUser"
      @saved="handleUserSaved" />

    <v-dialog
      v-model="deleteDialog"
      max-width="400">
      <v-card>
        <v-card-title class="text-lg font-semibold">Подтверждение удаления</v-card-title>
        <v-card-text>
          Вы уверены, что хотите удалить пользователя
          <strong>{{ selectedUser?.fullName }}</strong
          >?
        </v-card-text>
        <v-card-actions class="p-4!">
          <v-btn
            class="mr-auto"
            variant="outlined"
            @click="deleteDialog = false"
            >Отмена</v-btn
          >
          <v-btn
            color="error"
            variant="flat"
            @click="confirmDelete">
            Удалить
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      timeout="3000">
      {{ snackbar.message }}
    </v-snackbar>
  </div>
</template>

<style scoped>
  :deep(.data-table-custom thead th .v-data-table-header__content) {
    font-weight: 600;
  }
</style>
