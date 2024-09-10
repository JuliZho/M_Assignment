import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './', 
  timeout: 60000,      
  retries: 0,          
  use: {
    headless: false,             
    viewport: { width: 1600, height: 900 },
    ignoreHTTPSErrors: true,    
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
    actionTimeout: 10000,
  },
  projects: [
    {
      name: 'Desktop Chrome',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
  ],
  reporter: [ 
    ['html', { outputFile: './reports/results.html' }],              
  ],
});