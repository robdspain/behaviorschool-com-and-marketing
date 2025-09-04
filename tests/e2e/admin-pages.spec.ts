import { test, expect } from '@playwright/test';

const routes: { path: string; expectText: RegExp | string }[] = [
  { path: '/admin', expectText: 'Admin Dashboard' },
  { path: '/admin/blog', expectText: 'Blog Posts' },
  { path: '/admin/blog/editor', expectText: 'New Post' },
  { path: '/admin/email-templates', expectText: 'Email Templates Admin' },
  { path: '/admin/signups', expectText: 'Newsletter Signups' },
];

for (const { path, expectText } of routes) {
  test(`admin page loads: ${path}`, async ({ page }) => {
    await page.goto(path);

    // Every protected admin page should render the admin header
    await expect(page.getByText('Behavior School Admin')).toBeVisible({ timeout: 15000 });

    // And show a page-specific heading or marker text
    await expect(page.getByText(expectText)).toBeVisible();

    // Stay on the intended URL and no redirect back to login
    await expect(page).toHaveURL(new RegExp(path.replace('/', '\\/') + '$'));
  });
}

