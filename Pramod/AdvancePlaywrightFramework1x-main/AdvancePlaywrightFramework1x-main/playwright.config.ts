import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config();

function resolveBaseURL(): string {
  return process.env.BASE_URL || 'https://www.saucedemo.com';
}

const isCI = !!process.env.CI;

export default defineConfig({
  testDir: './src/tests',
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 4 : undefined,
  reporter: [
    ['./src/utils/CustomReporter.ts'],
    ['html', { outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['allure-playwright', {
      resultsDir: 'allure-results',
      reportName: 'Automation Report',
      environmentInfo: {
        BaseURL: resolveBaseURL(),
        Node: process.version,
        OS: process.platform,
        CI: String(isCI),
      },
      categories: [
        { name: 'Assertion failures', matchedStatuses: ['failed'] },
        { name: 'Broken tests / errors', matchedStatuses: ['broken'] },
        {
          name: 'Timeouts',
          matchedStatuses: ['broken', 'failed'],
          messageRegex: '.*Timeout.*',
        },
      ],
    }],
    ['list'],
  ],
  use: {
    baseURL: resolveBaseURL(),
    screenshot: 'only-on-failure',
    video: 'on',
    trace: 'on-first-retry',
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
    extraHTTPHeaders: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  },
  projects: [
    {
      name: 'api',
      testMatch: /src\/tests\/apiTests\/.*\.spec\.ts/,
    },
    {
      name: 'chromium',
      testIgnore: /src\/tests\/apiTests\/.*\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },
    // { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    // { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    // { name: 'mobile-chrome', use: { ...devices['Pixel 5'] } },
  ],
});
