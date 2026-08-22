import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "node:url";

const nuxtInternalPathsAlias = fileURLToPath(new URL("./nuxt.paths.mjs", import.meta.url));

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  alias: {
    "#internal/nuxt/paths": nuxtInternalPathsAlias,
  },
  build: {
    transpile: ["@pinia/nuxt"],
  },
  css: ['~/assets/css/main.css'],
  vite: {
    resolve: {
      alias: {
        "#internal/nuxt/paths": nuxtInternalPathsAlias,
      },
    },
    plugins: [
      tailwindcss(),
    ]
  },
  ssr: true,
  runtimeConfig: {
    public: {
      appUrl: process.env.APP_URL ?? 'https://trexorstore.com',
      apiUrl: process.env.NODE_ENV === 'development' 
        ? '/api' 
        : process.env.API_URL ?? 'https://apipay.wsa-elite.com',
    },
  },
  // 
  nitro: {
    alias: {
      "#internal/nuxt/paths": nuxtInternalPathsAlias,
    },
    routeRules: {
      '/api/**': {
        proxy: `${process.env.API_URL ?? 'https://apipay.wsa-elite.com'}/api/**`,
        cors: true,
      },
      '/sanctum/**': {
        proxy: `${process.env.API_URL ?? 'https://apipay.wsa-elite.com'}/sanctum/**`,
        cors: true,
      },
      '/get-geoip/**': {
        proxy: `http://ip-api.com/json/**`,
      },
    },
    compressPublicAssets: true,
  },

  modules: [
    '@nuxt/content', 
    '@nuxt/fonts', 
    '@nuxt/icon',
    '@nuxt/ui',
    '@nuxt/image', 
    '@nuxt/scripts', 
    '@pinia/nuxt', 
    'nuxt-charts'
  ],

  image: {
    inject: true,
    quality: 65,
    format: ['webp'],
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536,
    },
  },

  imports: {
    dirs: ['./stores'],
  },

  // 👇 هذا مهم لإعدادات الـ Proxy
  devServer: {
    https: false,
    host: 'localhost',
    port: 3000,
  },

  app: {
    head: {
      title: 'WSA PAY',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1.0, user-scalable=0, minimal-ui' },
        { 'http-equiv': 'X-UA-Compatible', content: 'IE=edge' },
        { name: 'description', content: 'WSA PAY Admin Dashboard' },
        { name: 'keywords', content: 'admin, dashboard, wsa, pay' },
        { name: 'author', content: 'WSA' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Montserrat:300,400,500,600' },
        { rel: 'stylesheet', href: '/app-assets/vendors/css/vendors.min.css' },
        { rel: 'stylesheet', href: '/app-assets/vendors/css/forms/select/select2.min.css' },
        { rel: 'stylesheet', href: '/app-assets/vendors/css/extensions/sweetalert2.min.css' },
        { rel: 'stylesheet', href: '/app-assets/vendors/css/tables/datatable/datatables.min.css' },
        { rel: 'stylesheet', href: '/app-assets/vendors/css/file-uploaders/dropzone.min.css' },
        { rel: 'stylesheet', href: '/app-assets/vendors/css/tables/datatable/extensions/dataTables.checkboxes.css' },
        { rel: 'stylesheet', href: '/app-assets/vendors/css/extensions/tether-theme-arrows.css' },
        { rel: 'stylesheet', href: '/app-assets/vendors/css/extensions/tether.min.css' },
        { rel: 'stylesheet', href: '/app-assets/vendors/css/extensions/shepherd-theme-default.css' },
        { rel: 'stylesheet', href: '/app-assets/css/bootstrap.min.css' },
        { rel: 'stylesheet', href: '/app-assets/css/bootstrap-extended.min.css' },
        { rel: 'stylesheet', href: '/app-assets/css/colors.min.css' },
        { rel: 'stylesheet', href: '/app-assets/css/components.min.css' },
        { rel: 'stylesheet', href: '/app-assets/css/themes/dark-layout.min.css' },
        { rel: 'stylesheet', href: '/app-assets/css/themes/semi-dark-layout.min.css' },
        { rel: 'stylesheet', href: '/app-assets/css/core/menu/menu-types/vertical-menu.min.css' },
        { rel: 'stylesheet', href: '/app-assets/css/core/colors/palette-gradient.min.css' },
        { rel: 'stylesheet', href: '/app-assets/css/pages/data-list-view.min.css' },
        { rel: 'stylesheet', href: '/app-assets/css/plugins/file-uploaders/dropzone.min.css' },
        { rel: 'stylesheet', href: '/app-assets/css/pages/card-analytics.min.css' },
        { rel: 'stylesheet', href: '/app-assets/css/plugins/tour/tour.min.css' },
        { rel: 'stylesheet', href: '/assets/css/style.css' }
      ],
      script: [
        { src: '/app-assets/vendors/js/vendors.min.js', defer: true },
        { src: '/app-assets/vendors/js/extensions/dropzone.min.js' },
        { src: '/app-assets/vendors/js/extensions/tether.min.js', defer: true },
        { src: '/app-assets/vendors/js/extensions/shepherd.min.js', defer: true },
        { src: '/app-assets/js/core/app-menu.min.js', defer: true },
        { src: '/app-assets/js/core/app.min.js', defer: true },
        { src: '/app-assets/js/scripts/components.min.js', defer: true },
        { src: '/app-assets/js/scripts/customizer.min.js', defer: true },
        { src: '/app-assets/js/scripts/footer.min.js', defer: true },
      ]
    }
  }
})
