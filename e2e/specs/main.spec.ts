import { test, expect, type Page } from '@playwright/test';

test.describe('Signup Test', () => {
  test('Should create an account of passenger', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await page.locator('input[name="name"]').fill('John Doe');
    await page.locator('input[name="email"]').fill(`john.doe${Math.random()}@gmail.com`);
    await page.locator('input[name="cpf"]').fill('97456321558');
    await page.locator('input[name="password"]').fill('123456');
    await page.locator('input[name="isPassenger"]').check();
    await page.locator('input[type="submit"]').click();
    await expect(page.locator('.messageSuccess')).toHaveText(/sucesso\!/);
  });

  test('Should don\'t create an account of passenger when invalid datas', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await page.locator('input[name="name"]').fill('John');
    await page.locator('input[name="email"]').fill(`john.doe${Math.random()}@gmail.com`);
    await page.locator('input[name="cpf"]').fill('97456321558');
    await page.locator('input[name="password"]').fill('123456');
    await page.locator('input[name="isPassenger"]').check();
    await page.locator('input[type="submit"]').click();
    await expect(page.locator('.messageError')).toHaveText('Invalid name');
  });
});