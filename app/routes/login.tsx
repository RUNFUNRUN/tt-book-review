import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import type { z } from 'zod';
import { apiBaseUrl, postSigninSchema } from '~/api';
import { Button } from '~/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { useUser } from '~/hooks/use-user';
import { loginSchema } from '~/lib/schema';

export const meta = () => {
  return [{ title: 'ログイン | Book Review App' }];
};

const Login = () => {
  const { data: user, setToken, isLoading } = useUser();
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && user) {
      navigate('/');
    }
  }, [user, isLoading, navigate]);

  const onSubmit = async (loginForm: z.infer<typeof loginSchema>) => {
    try {
      const postUsers = await fetch(new URL('/signin', apiBaseUrl), {
        method: 'POST',
        body: JSON.stringify({
          email: loginForm.email,
          password: loginForm.password,
        }),
      });

      // 認証失敗は403が返ってくる
      if (postUsers.status === 403) {
        toast.error(
          'メールアドレスかパスワードが間違っています。もう一度お試しください。',
        );
        return;
      }
      if (!postUsers.ok) {
        toast.error('エラーが発生しました。もう一度お試しください。');
        return;
      }

      const parsedPostSignin = postSigninSchema.safeParse(
        await postUsers.json(),
      );

      if (parsedPostSignin.error) {
        throw new Error();
      }

      const token = parsedPostSignin.data.token;
      setToken(token);

      form.reset();
      navigate('/');
    } catch {
      toast.error('エラーが発生しました。もう一度お試しください。');
    }
  };

  const isSubmitting = form.formState.isSubmitting;

  return (
    <main className='flex flex-col min-h-dvh'>
      <Card className='sm:w-[600px] m-auto'>
        <CardHeader className='text-center'>
          <CardTitle className='text-2xl font-bold'>ログイン</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>メールアドレス</FormLabel>
                    <FormControl>
                      <Input {...field} className='md:text-lg' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>パスワード</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type='password'
                        className='md:text-lg'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type='submit' className='w-full' disabled={isSubmitting}>
                送信
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className='block text-center'>
          <p>
            <Link
              to='/login'
              className='text-lg underline text-blue-600 hover:text-blue-500'
            >
              新規登録はこちら
            </Link>
          </p>
        </CardFooter>
      </Card>
    </main>
  );
};

export default Login;
