// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },

  vite: {
    build: {
      target: 'es2022'
    },
    optimizeDeps: {
      esbuildOptions: {
        target: 'es2022'
      }
    }
  },
  tailwindcss: {
    viewer: false
  },

  modules: ["@nuxtjs/tailwindcss", "@nuxt/content"]
})