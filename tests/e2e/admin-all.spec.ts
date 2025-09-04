import { test, expect } from '@playwright/test';

test('admin login and all admin pages render', async ({ page }) => {
  // Login page (public, no admin header)
  await page.goto('/admin/login');
  await expect(page.getByRole('heading', { name: 'Admin Access' })).toBeVisible({ timeout: 15000 });
  await expect(page.getByRole('button', { name: /Continue with Google|Authentication Not Available|Signing in.../ })).toBeVisible();
  await expect(page).toHaveURL(/\/admin\/login$/);

  // Protected admin pages (should show admin header)
  const checkAdminPage = async (path: string, marker: RegExp | string) => {
    await page.goto(path);
    await expect(page.getByText('Behavior School Admin')).toBeVisible({ timeout: 20000 });
    await expect(page.getByText(marker)).toBeVisible({ timeout: 10000 });
    await expect(page).toHaveURL(new RegExp(path.replace('/', '\\/') + '$'));
  };

  await checkAdminPage('/admin', 'Admin Dashboard');
  await checkAdminPage('/admin/blog', 'Blog Posts');
  // Editor: look for title input placeholder instead of static text
  await page.goto('/admin/blog/editor');
  await expect(page.getByText('Behavior School Admin')).toBeVisible({ timeout: 20000 });
  await expect(page.getByPlaceholder('Post title')).toBeVisible({ timeout: 10000 });
  await expect(page).toHaveURL(/\/admin\/blog\/editor$/);
  await checkAdminPage('/admin/email-templates', 'Email Templates Admin');
  await checkAdminPage('/admin/signups', 'Newsletter Signups');
});
