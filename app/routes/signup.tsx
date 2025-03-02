import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import type { z } from 'zod';
import { apiBaseUrl, postUploads, postUsersSchema } from '~/api';
import { Button } from '~/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
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
import { signupSchema } from '~/lib/schema';

export const meta = () => {
  return [{ title: '新規登録 | Book Review App' }];
};

const Signup = () => {
  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      icon: undefined,
    },
  });
  const navigate = useNavigate();

  const onSubmit = async (signupForm: z.infer<typeof signupSchema>) => {
    try {
      const postUsersRes = await fetch(new URL('/users', apiBaseUrl), {
        method: 'POST',
        body: JSON.stringify({
          name: signupForm.username,
          email: signupForm.email,
          password: signupForm.password,
        }),
      });
      if (postUsersRes.status === 409) {
        toast.error('既に登録されているメールアドレスです');
        return;
      }
      if (!postUsersRes.ok) {
        toast.error('エラーが発生しました。もう一度お試しください。');
        return;
      }

      const parsedPostUsers = postUsersSchema.safeParse(
        await postUsersRes.json(),
      );

      if (parsedPostUsers.error) {
        throw new Error();
      }

      const token = parsedPostUsers.data.token;
      localStorage.setItem('token', token);

      if (signupForm.icon.length === 1) {
        const icon = signupForm.icon[0];
        const postUploadsRes = await postUploads({ token, icon });
        if (!postUploadsRes.ok) {
          toast.error('エラーが発生しました。もう一度お試しください。');
          return;
        }
      }
      form.reset();
      navigate('/');
    } catch {
      toast.error('エラーが発生しました。もう一度お試しください。');
    }
  };

  return (
    <main className='flex flex-col min-h-dvh'>
      <Card className='sm:w-[600px] m-auto'>
        <CardHeader className='text-center'>
          <h1 className='text-2xl font-bold'>新規登録</h1>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
              <FormField
                control={form.control}
                name='username'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ユーザー名</FormLabel>
                    <FormControl>
                      <Input {...field} className='md:text-lg' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
              <FormField
                control={form.control}
                name='confirmPassword'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>確認用パスワード</FormLabel>
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
              <FormField
                control={form.control}
                name='icon'
                render={() => (
                  <FormItem>
                    <FormLabel>アイコン(任意)</FormLabel>
                    <FormControl>
                      <Input
                        type='file'
                        className='md:text-lg'
                        accept='image/*'
                        multiple
                        {...form.register('icon')}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type='submit' className='w-full'>
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
              ログインはこちら
            </Link>
          </p>
        </CardFooter>
      </Card>
    </main>
  );
};

export default Signup;
