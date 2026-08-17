import { defineConfig } from '@playwright/test'

const baseURL = 'http://127.0.0.1:4173/docs-site/'

export default defineConfig({
  testDir: './tests/browser',
  outputDir: 'test-results/browser',
  fullyParallel: false,
  forbidOnly: true,
  retries: 0,
  workers: 1,
  timeout: 60_000,
  expect: { timeout: 10_000 },
  reporter: [['list'], ['html', { outputFolder: 'playwright-report', open: 'never' }]],
  use: {
    baseURL,
    browserName: 'chromium',
    colorScheme: 'dark',
    locale: 'en-US',
    reducedMotion: 'reduce',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    video: 'off'
  },
  webServer: {
    command: 'node node_modules/vitepress/bin/vitepress.js preview docs --host 127.0.0.1 --port 4173',
    url: baseURL,
    reuseExistingServer: false,
    timeout: 120_000
  }
})
