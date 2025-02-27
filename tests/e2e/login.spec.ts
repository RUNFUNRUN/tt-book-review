import { expect, test } from '@playwright/test';

test.describe('ログイン画面のテスト', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/login');
  });

  test('不正なメールアドレスの場合、メール用エラーメッセージが表示される', async ({
    page,
  }) => {
    await page.fill('input[name="email"]', 'invalid-email');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');

    await expect(
      page.getByText('有効なメールアドレスを入力してください'),
    ).toBeVisible();
    await expect(
      page.getByText('パスワードは8文字以上で入力してください'),
    ).not.toBeVisible();
    await expect(
      page.getByText('パスワードは半角英数字混合で入力してください'),
    ).not.toBeVisible();
  });

  test('パスワードが8文字以下の場合、パスワード用エラーメッセージが表示される', async ({
    page,
  }) => {
    await page.fill('input[name="email"]', 'user@example.com');
    await page.fill('input[name="password"]', '');
    await page.click('button[type="submit"]');

    await expect(
      page.getByText('パスワードは8文字以上で入力してください'),
    ).toBeVisible();
    await expect(
      page.getByText('有効なメールアドレスを入力してください'),
    ).not.toBeVisible();
  });

  test('パスワードが英数字混合でない場合、パスワード用エラーメッセージが表示される', async ({
    page,
  }) => {
    await page.fill('input[name="email"]', 'user@example.com');
    await page.fill('input[name="password"]', 'aaaaaaaa');
    await page.click('button[type="submit"]');

    await expect(
      page.getByText('パスワードは半角英数字混合で入力してください'),
    ).toBeVisible();
    await expect(
      page.getByText('有効なメールアドレスを入力してください'),
    ).not.toBeVisible();
  });

  test('正しい入力の場合、エラーメッセージが表示されない', async ({ page }) => {
    await page.fill('input[name="email"]', 'user@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');

    await expect(
      page.getByText('有効なメールアドレスを入力してください'),
    ).not.toBeVisible();
    await expect(
      page.getByText('パスワードは8文字以上で入力してください'),
    ).not.toBeVisible();
    await expect(
      page.getByText('パスワードは半角英数字混合で入力してください'),
    ).not.toBeVisible();
  });
});
