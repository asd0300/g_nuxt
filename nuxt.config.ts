// https://nuxt.com/docs/api/configuration/nuxt-config
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
export default defineNuxtConfig({
  imports: {
    autoImport: true,
    dirs:['Interface/*.ts']
  },
  devtools: { enabled: true },
  build: {
    transpile: ['vuetify'],
  },
  modules: [
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }))
      })
    },
    '@pinia/nuxt'
    //...
  ],
  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
  runtimeConfig: {
    public:{
      hostDev: process.env.Backend
    }
  },
  nitro: {
      devProxy: {
          '/api': {
              target: `${process.env.Backend}.:4000`,
              changeOrigin: true,
              prependPath: true,
          },
      }
  },
})
