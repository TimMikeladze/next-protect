import { test } from '@playwright/test';

test('signs in with password', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('textbox').fill('password');

  await page.getByRole('button').click();

  await page.getByText('Get started by editing src/app/page.tsx').click();
});
