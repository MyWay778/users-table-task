// https://nuxt.com/docs/api/configuration/nuxt-config
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: ['@pinia/nuxt', '@nuxtjs/tailwindcss'],

  css: ['~/styles/vuetify-custom.scss'],

  vite: {
    plugins: [vuetify({ autoImport: true })],

    vue: {
      template: {
        transformAssetUrls,
      },
    },

    css: {
      preprocessorOptions: {
        scss: {
          quietDeps: true,
        },
      },
    },
  },

  build: {
    transpile: ['vuetify'],
  },

  typescript: {
    strict: false,
  },

  ssr: true,
})
