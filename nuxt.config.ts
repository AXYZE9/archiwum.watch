// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  modules: [
    '@nuxtjs/tailwindcss',
    'nuxt-icon',
    '@nuxtjs/google-fonts',
    'nuxt-meilisearch'
  ],
  googleFonts: {
    families: {
      Poppins: [400, 700, 900]
    }
  },
  meilisearch: {
    hostUrl: 'https://cdn1.fivecity.watch:7700/',
    searchApiKey: '45b7fda5068e086be7df0e92a9c674dbf37d5dd478606597dbfb1d13241748b9',
    instantSearch: {
      theme: 'reset'
    },
  },
  app: {
    pageTransition: { name: 'page', mode: 'out-in' }
  }
})