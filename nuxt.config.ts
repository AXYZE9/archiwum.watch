// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  modules: [
    '@nuxtjs/tailwindcss',
    'nuxt-icon',
    '@nuxtjs/google-fonts',
    "@nuxtjs/algolia"
  ],
  googleFonts: {
    families: {
      Poppins: [400, 700, 900]
    }
  },
  algolia: {
    apiKey: 'dc0298095ba5f338ba6aca8b1cbb2896',
    applicationId: '5NXV3JH6H3',
    globalIndex: '',
    lite: true,
    cache: true,
    useFetch: false,
    instantSearch: {
      theme: 'reset'
    },
  },
  app: {
    pageTransition: { name: 'page', mode: 'out-in' }
  }
})