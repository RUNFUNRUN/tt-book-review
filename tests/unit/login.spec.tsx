import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Login from '~/routes/login';

describe('Loginコンポーネント', () => {
  it('フォームとボタン、各入力フィールドが正しくレンダリングされることを確認する', () => {
    const { container } = render(<Login />);

    const form = container.querySelector('form');
    expect(form).toBeInTheDocument();

    const emailInput = screen.getByLabelText('メールアドレス');
    expect(emailInput).toBeInTheDocument();
    expect(emailInput.tagName).toBe('INPUT');

    const passwordInput = screen.getByLabelText('パスワード');
    expect(passwordInput).toBeInTheDocument();
    expect(passwordInput.tagName).toBe('INPUT');

    const button = screen.getByRole('button', { name: '送信' });
    expect(button).toBeInTheDocument();
    expect(button.tagName).toBe('BUTTON');
  });
});
