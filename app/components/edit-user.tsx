import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';
import { apiBaseUrl, type getUsersSchema, putUsersSchema } from '~/api';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import { Input } from './ui/input';

export const EditUser = ({
  user,
  token,
  refetch,
}: {
  user: z.infer<typeof getUsersSchema>;
  token: string;
  refetch: () => Promise<void>;
}) => {
  const form = useForm<z.infer<typeof putUsersSchema>>({
    resolver: zodResolver(putUsersSchema),
    defaultValues: {
      name: user.name,
    },
  });

  const onSubmit = async (editForm: z.infer<typeof putUsersSchema>) => {
    try {
      const response = await fetch(new URL('/users', apiBaseUrl), {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editForm),
      });
      if (!response.ok) {
        throw new Error();
      }
      await refetch();
      form.reset();
      toast.success('ユーザー情報を更新しました。');
    } catch {
      toast.error('エラーが発生しました。もう一度お試しください。');
    }
  };

  const isSubmitting = form.formState.isSubmitting;

  return (
    <Card className='sm:w-[600px] m-auto'>
      <CardHeader className='text-center'>
        <CardTitle className='text-2xl font-bold'>ユーザー情報編集</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='name'
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
            <Button type='submit' className='w-full' disabled={isSubmitting}>
              送信
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
