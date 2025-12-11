// https://nuxt.com/docs/api/configuration/nuxt-config
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  css: ['./app/styles/index.css'],

  modules: ['@pinia/nuxt'],

  vite: {
    plugins: [vuetify({ autoImport: true }), tailwindcss()],

    vue: {
      template: {
        transformAssetUrls
      }
    },

    css: {
      preprocessorOptions: {
        scss: {
          quietDeps: true
        }
      }
    },

    build: {
      sourcemap: false
    }
  },

  build: {
    transpile: ['vuetify']
  },

  typescript: {
    strict: false
  },

  ssr: true
})
