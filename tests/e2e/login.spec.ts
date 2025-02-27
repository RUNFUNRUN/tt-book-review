import { expect, test } from '@playwright/test';

test.describe('ログイン画面のテスト', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/login');
  });

  test('メールアドレス未入力の場合、メール用エラーメッセージが表示される', async ({
    page,
  }) => {
    await page.fill('input[name="email"]', 'invalid-email');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');

    await expect(
      page.getByText('メールアドレスを入力してください'),
    ).toBeVisible();
    await expect(
      page.getByText('パスワードを入力してください'),
    ).not.toBeVisible();
  });

  test('パスワードが未入力の場合、パスワード用エラーメッセージが表示される', async ({
    page,
  }) => {
    await page.fill('input[name="email"]', 'user@example.com');
    await page.fill('input[name="password"]', '');
    await page.click('button[type="submit"]');

    await expect(page.getByText('パスワードを入力してください')).toBeVisible();
    await expect(
      page.getByText('メールアドレスを入力してください'),
    ).not.toBeVisible();
  });

  test('正しい入力の場合、エラーメッセージが表示されない', async ({ page }) => {
    await page.fill('input[name="email"]', 'user@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');

    await expect(
      page.getByText('メールアドレスを入力してください'),
    ).not.toBeVisible();
    await expect(
      page.getByText('パスワードを入力してください'),
    ).not.toBeVisible();
  });
});
