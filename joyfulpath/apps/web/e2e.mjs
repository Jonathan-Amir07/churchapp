import { chromium } from '@playwright/test';
import fs from 'fs';

const BASE_URL = 'http://localhost:3000';
const CREDENTIALS = {
  admin: { username: 'test_admin', password: 'password123' },
  student: { username: 'test_student', password: 'password123' },
  parent: { username: 'test_parent', password: 'password123' },
  instructor: { username: 'test_instructor', password: 'password123' },
  priest: { username: 'test_priest', password: 'password123' }
};

const viewports = [
  { width: 375, height: 812 },
  { width: 768, height: 1024 },
  { width: 1440, height: 900 }
];

async function runTests() {
  console.log('Starting Playwright E2E tests...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  let consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  page.on('pageerror', err => {
    consoleErrors.push(err.message);
  });

  // 1. Check RTL (Arabic default)
  await page.goto(`${BASE_URL}/login`);
  await page.waitForLoadState('networkidle');
  let dir = await page.evaluate(() => document.documentElement.dir);
  console.log(`Initial direction: ${dir}`);

  // Log in as student
  const inputs = page.locator('input');
  await inputs.nth(0).fill(CREDENTIALS.student.username);
  await inputs.nth(1).fill(CREDENTIALS.student.password);
  await page.click('button[type="submit"]');
  await page.waitForURL('**/student/dashboard');

  // Navigate to features
  const routes = [
    '/student/dashboard',
    '/student/games',
    '/student/tasks',
    '/student/events',
    '/student/quizzes',
    '/student/store'
  ];

  for (const route of routes) {
    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.goto(`${BASE_URL}${route}`);
      await page.waitForLoadState('networkidle');

      const bodyText = await page.evaluate(() => document.body.innerText);
      if (bodyText.includes('MISSING_MESSAGE')) {
        console.error(`Missing translation found on ${route} at ${viewport.width}px`);
      }

      // Check for horizontal overflow
      const overflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth;
      });
      if (overflow) {
        console.error(`Horizontal overflow detected on ${route} at ${viewport.width}px`);
      }
    }
  }

  console.log('Console errors encountered:');
  consoleErrors.forEach(err => console.log(err));

  await browser.close();
  console.log('E2E tests complete.');
}

runTests().catch(console.error);
