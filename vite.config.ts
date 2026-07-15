import { defineConfig } from 'vite'
import { ViteEjsPlugin } from 'vite-plugin-ejs'
import { qrcode } from 'vite-plugin-qrcode'
import { resolve } from 'path'
import { ViteWatchVideoFolderPlugin, ViteWatchEJSFolderPlugin, ViteWatchFontsFolderPlugin, ViteWatchSVGFolderPlugin, ViteWatchIMGFolderPlugin } from './externe/plugins/watchFolder'
import { externe } from './externe/plugins/ejsUtils'
import autoprefixer from 'autoprefixer'

export default defineConfig({
  base: './',
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
      },
      output: {
         // JS
        entryFileNames: 'assets/js/[name].js',
        chunkFileNames: 'assets/js/[name]-[hash].js',

        // ассеты (шрифты, картинки)
        assetFileNames: ({ name }) => {
          if (!name) return 'assets/[name]-[hash][extname]'

          if (/\.(woff2?|ttf|otf|eot)$/i.test(name)) {
            return 'assets/fonts/[name][extname]'
          }
          if (/\.(png|jpe?g|gif|svg|webp|mp4|mov|webm)$/i.test(name)) {
            return 'assets/media/[name][extname]'
          }
          if (/\.(css)$/i.test(name)) {
            return 'assets/styles/[name][extname]'
          }

          return 'assets/[name][extname]'
        },
      },
      external: [
        /externe\/plugins\/.*/,
        /externe\/scripts\/phpmailer\/.*/,
        /externe\/scripts\/dummyaside\/.*/,
        /externe\/scripts\/!empty\/.*/,
      ]
    }
  },
  server: {
    watch: {
      ignored: [
        '**/node_modules/**',
        '**/.git/**',
        '**/dist/**',
        '**/build/**',
        '**/.DS_Store',        
        '**/*.tmp',           
        '**/.vscode/**',
        // '**/public/**'    
      ],
      usePolling: true,      
      interval: 1000          
    },
    hmr: {
      overlay: false,     
      // timeout: 3000     
    },
    proxy: {
      '/php': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/php/, '')
      }
    }
  },
  optimizeDeps: {
    include: ['fluent-ffmpeg', 'vite-plugin-ejs'],
    exclude: []
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '~': resolve(__dirname, 'externe')
    },
  },
  css: {
    postcss: {
      plugins: [autoprefixer({
        overrideBrowserslist: [
          ">0.5%",
          "last 2 versions",
          "Firefox ESR",
          "Safari >= 10",
          "not dead"
        ]
      })]
    },
    preprocessorOptions: {
      scss: {
        additionalData: `$BUILD_ENV: "${process.env.NODE_ENV}";`,
        silenceDeprecations: [
          'import',
          'mixed-decls'
        ]
      }
    }
  },
  plugins: [
    qrcode(),
    ViteEjsPlugin({
      head_component: {
        lang: 'en',
        title: 'My App',
        description: 'Default project description',
        keywords: 'vite, ejs, scss, javascript',
        author: 'Your Name'
      },
      externe
    }, {
      ejs: {
        views: [resolve(__dirname)]
      }
    }),
    ViteWatchEJSFolderPlugin({
      paths: [
        `${__dirname}/src/ejs/views/`,
        `${__dirname}/src/ejs/pages/`,
      ],
      outputDestination: {
         pages: {
           fileNameException: [
            'test.ejs',
            'externeComponents.ejs'
           ],
           fileDestination: `${__dirname}`
         },
         rest: {
           fileName: [
            'test.ejs',
            'externeComponents.ejs'
           ],
           fileDestination: `${__dirname}/externe/pages/`
         }
        }
    }),
    ViteWatchSVGFolderPlugin({
      relativePath: `${__dirname}/public/media/icons/`,
      nameOfTheOutputFile: 'sprite.svg',
      dummy: {
        destination:  `${__dirname}/externe/pages/`,
        fileName:  'fontIcons.html'
      },
      convertType: 0
    }),
    ViteWatchFontsFolderPlugin({
      relativePath: `${__dirname}/src/assets/fonts`,
      outputDestination: `${__dirname}/src/assets/styles/base/_fonts.scss`
    }),
    ViteWatchVideoFolderPlugin({
      relativePath: `${__dirname}/public/media/video`,
      outputVideoDirectory: `${__dirname}/public/media/converted`,
      outputVideoFormat: [".mp4"],
      posterDirectory: `${__dirname}/public/media/image/poster`
    }),
    ViteWatchIMGFolderPlugin({
      relativePath: `${__dirname}/public/media/image/watched`,
      outputDestination: `${__dirname}/public/media/image`
    })
  ],
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
  }
})