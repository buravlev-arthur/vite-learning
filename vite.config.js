import Inspect from 'vite-plugin-inspect';
import typeChecker from 'vite-plugin-checker';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';

export default {
  // publicDir: 'build',
  // envPrefix: 'APP_',
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
