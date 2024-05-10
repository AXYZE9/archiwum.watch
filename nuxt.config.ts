// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
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
    hostUrl:  'http://135.181.16.49:7700', //required
    searchApiKey: 'ZoMWAXkrK2', // required
    instantSearch: true
  },
  app: {
    pageTransition: { name: 'page', mode: 'out-in' }
  }
})
