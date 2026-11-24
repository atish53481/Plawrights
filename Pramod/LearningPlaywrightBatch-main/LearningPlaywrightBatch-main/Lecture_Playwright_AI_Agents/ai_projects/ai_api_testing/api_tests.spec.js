/**
 * API Contract Tests
 * Playwright tests validating API contracts
 */
const { test, expect } = require('@playwright/test');

test.describe('API Contract Validation', () => {
  const BASE_URL = 'https://the-internet.herokuapp.com';

  test('Homepage returns 200 with expected content', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/`);
    expect(response.status()).toBe(200);

    const body = await response.text();
    expect(body).toContain('Welcome to the-internet');
    expect(body).toContain('<h1');
  });

  test('Login page has form elements', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/login`);
    expect(response.status()).toBe(200);

    const body = await response.text();
    expect(body).toContain('<form');
    expect(body).toContain('username');
    expect(body).toContain('password');
  });

  test('Status code 200 endpoint returns 200', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/status_codes/200`);
    expect(response.status()).toBe(200);
  });

  test('Status code 404 endpoint returns 404', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/status_codes/404`);
    expect(response.status()).toBe(404);
  });

  test('Status code 500 endpoint returns 500', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/status_codes/500`);
    expect(response.status()).toBe(500);
  });
});
