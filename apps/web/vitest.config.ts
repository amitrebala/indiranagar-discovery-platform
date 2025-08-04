import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    globals: true,
    css: true,
    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'tests/',
        '**/*.config.{ts,js}',
        '**/*.d.ts',
        '.next/',
        'coverage/',
        'app/globals.css',
        'tailwind.config.js',
        'next.config.ts',
        'postcss.config.mjs',
        'eslint.config.mjs'
      ],
      thresholds: {
        global: {
          branches: 70,
          functions: 70,
          lines: 70,
          statements: 70
        }
      }
    },
    // Prevent multiple processes and add resource limits
    poolOptions: {
      threads: {
        singleThread: true,
      },
    },
    // Add timeout to prevent hanging processes
    testTimeout: 30000,
    hookTimeout: 10000,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
})