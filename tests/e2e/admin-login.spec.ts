import { test, expect } from '@playwright/test';

test('admin login page renders and is not stuck loading', async ({ page }) => {
  // Go to the login page
  await page.goto('/admin/login');

  // Expect key static text to appear quickly
  await expect(page.getByRole('heading', { name: 'Admin Access' })).toBeVisible({ timeout: 10000 });

  // Either the login button or the disabled state when auth not configured should be visible
  const continueBtn = page.getByRole('button', { name: /Continue with Google|Authentication Not Available|Signing in.../ });
  await expect(continueBtn).toBeVisible({ timeout: 10000 });

  // Ensure we remain on the login URL (no redirect loop)
  await page.waitForTimeout(1500);
  await expect(page).toHaveURL(/\/admin\/login$/);
});

