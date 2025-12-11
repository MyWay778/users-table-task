import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import { VDateInput } from 'vuetify/labs/VDateInput'
import { ru } from 'vuetify/locale'
import '@mdi/font/css/materialdesignicons.css'
import '~/styles/vuetify-custom.scss'

export default defineNuxtPlugin(nuxtApp => {
  const vuetify = createVuetify({
    components: {
      VDateInput
    },
    icons: {
      defaultSet: 'mdi',
      aliases,
      sets: {
        mdi
      }
    },
    theme: {
      defaultTheme: 'light'
    },
    date: {
      formats: {
        // for built-in adapter
        weekdayNarrow: { weekday: 'narrow' }
      }
    },
    locale: {
      locale: 'ru',
      messages: {
        ru
      }
    },
    ssr: true
  })

  nuxtApp.vueApp.use(vuetify)
})
