import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('メールアドレスを入力してください'),
  password: z.string().min(1, 'パスワードを入力してください'),
});

export const signupSchema = z
  .object({
    username: z.string().min(1, 'ユーザー名を入力してください'),
    email: z.string().email('有効なメールアドレスを入力してください'),
    password: z
      .string()
      .min(8, 'パスワードは8文字以上で入力してください')
      .max(50, 'パスワードは50文字以下で入力してください')
      .regex(
        /^(?=.*?[a-z])(?=.*?\d)[a-z\d]{8,100}$/i,
        'パスワードは半角英数字混合で入力してください',
      ),
    confirmPassword: z.string().min(1, '確認用パスワードを入力してください'),
    icon: z
      .custom<FileList>()
      .refine((file) => file.length <= 1, 'ファイルは1つ選択してください。'),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        path: ['confirmPassword'],
        code: z.ZodIssueCode.custom,
        message: 'パスワードが一致しません',
      });
    }
  });
