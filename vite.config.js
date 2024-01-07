import Inspect from 'vite-plugin-inspect';
import typeChecker from 'vite-plugin-checker';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';

export default {
  // publicDir: 'build',
  // envPrefix: 'APP_',
  server: {
    // порт dev-сервера
    port: '3000',
    // отключить инкрементацию порта (всегда запускать dev-server на одном и том же порте)
    strictPort: true,
    // заголовки ответа (Response) на запросы
    headers: {
      'X-App-Mode': 'development',
    },
    // проксирование запросов: localhost:8080/products -> dummyjson.com/products
    proxy: {
      '/products': 'https://dummyjson.com',
      // конфигурация proxy в виде объекта
      '/api': {
        // адрес переадресации
        target: 'https://dummyjson.com',
        // изменение заголовка "Origin" на адрес из поля target
        changeOrigin: true,
        // преобразование пути запроса
        rewrite: (path) => path.replace(/\/api/, '')
      }
    },
  },
  // Конфигурация аналогична конфигурации dev-сервера (выше)
  preview: {
    port: '8080',
    strictPort: true,
    // адрес запроса при открытии приложения в браузере
    open: '/api/products',
    headers: {
      'X-App-Mode': 'production',
    },
    proxy: {
      '/products': 'https://dummyjson.com',
      '/api': {
        target: 'https://dummyjson.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/\/api/, '')
      }
    },
  },
  esbuild: {
    jsxFactory: 'create',
    jsxInject: 'import create from "/src/12-create.js"',
  },
  plugins: [
    Inspect(),
    typeChecker({
      typescript: true,
      eslint: {
        lintCommand: 'eslint "./**/*.{ts,tsx}"'
      }
    }),
    ViteImageOptimizer({
      jpg: {
        quality: 10
      }
    })
  ],
  resolve: {
    alias: {
      '@': new URL('src/assets', import.meta.url).pathname
    }
  },
  build: {
    rollupOptions: {
      input: {
        main: new URL('index.html', import.meta.url).pathname,
        login: new URL('login/index.html', import.meta.url).pathname
      }
    }
  }
}
