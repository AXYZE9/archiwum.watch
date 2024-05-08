// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  routeRules: {
    '/':  { ssr: false },
    '/crawler':  { ssr: true },
    '/crawler/**':  { ssr: true },
  },
  devtools: { enabled: false },
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
