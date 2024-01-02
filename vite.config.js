import Inspect from 'vite-plugin-inspect';
import typeChecker from 'vite-plugin-checker';

export default {
  // publicDir: 'build',
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
}
