import { test, expect } from '@playwright/test';

test('user with valid creds can login into', async ({ page }) => {
  await page.goto('/auth/signin');
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('test@test.com');
  await page.getByRole('textbox', { name: 'Hasło' }).click();
  await page.getByRole('textbox', { name: 'Hasło' }).fill('test');
  await page.getByRole('button', { name: 'Zaloguj się' }).click();

  await expect(page).toHaveURL('/collections');
  await expect(page.getByRole('heading', { name: 'Kolekcje' })).toBeVisible();
});

test('user with invalid creds cannot login into', async ({ page }) => {
  await page.goto('/auth/signin');
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('test@test.com');
  await page.getByRole('textbox', { name: 'Hasło' }).click();
  await page.getByRole('textbox', { name: 'Hasło' }).fill('Password');
  await page.getByRole('button', { name: 'Zaloguj się' }).click();

  await expect(page.getByLabel(/Notifications/)).toContainText('Error')
});