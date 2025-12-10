// https://nuxt.com/docs/api/configuration/nuxt-config
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: ['@pinia/nuxt', '@nuxtjs/tailwindcss'],

  css: ['vuetify/styles'],

  vite: {
    plugins: [vuetify({ autoImport: true })],

    vue: {
      template: {
        transformAssetUrls,
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
