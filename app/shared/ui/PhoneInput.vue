<script setup lang="ts">
  import { Mask } from 'maska'

  const model = defineModel<string>()

  const props = withDefaults(
    defineProps<{
      label?: string
      maxlength?: number
      valueMask?: string
    }>(),
    {
      label: 'Телефон',
      maxlength: 17
    }
  )

  const phoneDisplayMask = new Mask({ mask: '+7(###)-###-##-##' })
  let updateValueMask = props.valueMask ? new Mask({ mask: props.valueMask }) : null

  const handleKeydown = (event: KeyboardEvent) => {
    // Разрешить управляющие клавиши (Backspace, Delete, стрелки, Tab и т.д.)
    const controlKeys = [
      'Backspace',
      'Delete',
      'ArrowLeft',
      'ArrowRight',
      'ArrowUp',
      'ArrowDown',
      'Tab',
      'Home',
      'End',
      'Enter'
    ]

    // Разрешить комбинации Ctrl/Cmd (Ctrl+A, Ctrl+C, Ctrl+V и т.д.)
    if (event.ctrlKey || event.metaKey) {
      return
    }

    // Разрешить, если это управляющая клавиша
    if (controlKeys.includes(event.key)) {
      return
    }

    // Проверить, является ли клавиша цифрой (0-9)
    if (/^\d$/.test(event.key)) {
      return
    }

    // Предотвратить все остальные клавиши
    event.preventDefault()
  }
</script>

<template>
  <v-text-field
    :label="props.label"
    variant="outlined"
    required
    type="tel"
    :maxlength="props.maxlength"
    :model-value="phoneDisplayMask.masked(model)"
    @update:model-value="
      value => {
        model = updateValueMask ? updateValueMask.masked(value) : phoneDisplayMask.unmasked(value)
      }
    "
    @keydown="handleKeydown" />
</template>
