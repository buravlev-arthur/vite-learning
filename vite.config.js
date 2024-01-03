import Inspect from 'vite-plugin-inspect';
import typeChecker from 'vite-plugin-checker';

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
    })
  ],
  resolve: {
    alias: {
      '@': new URL('src/assets', import.meta.url).pathname
    }
  }
}
