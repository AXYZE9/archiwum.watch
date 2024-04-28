// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    'nuxt-icon',
    '@nuxtjs/google-fonts'
  ],
  googleFonts: {
    families: {
      Poppins: [400, 700, 900]
    }
  },
  app: {
    pageTransition: { name: 'page', mode: 'out-in' }
  }
})
