// @ts-check
const { defineConfig, devices } = require('@playwright/test');
const path = require('path');

module.exports = defineConfig({
  testDir: './cli_project/tests',
  timeout: 30000,
  retries: 0, // No retries - we want to capture intentional failures
  workers: 1, // Run sequentially for clear output

  use: {
    baseURL: 'https://the-internet.herokuapp.com',
    headless: true,
    screenshot: 'only-on-failure',
    trace: 'on', // Always record traces for trace viewer demos
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],

  reporter: [
    ['html', { outputFolder: path.resolve(__dirname, 'cli_project/reports/html-report'), open: 'never' }],
    ['json', { outputFile: path.resolve(__dirname, 'cli_project/reports/results.json') }],
    ['./cli_project/reporters/CustomTTAReporter.js'],
  ],
});
