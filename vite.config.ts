/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@types': '/src/types',
      '@hooks': '/src/hooks',
      '@constants': '/src/constants',
      '@services': '/src/services'
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.test.{ts,tsx}',
        '**/*.spec.{ts,tsx}',
        'dist/',
        'coverage/',
        'public/',
        '*.config.{js,ts}',
        'src/entry-client.tsx',
        'src/entry-server.tsx',
        'src/vite-env.d.ts',
        'server.js'
      ],
      include: [
        'src/**/*.{ts,tsx}'
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80
        }
      }
    }
  }
})
