import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import type { z } from 'zod';
import { apiBaseUrl, postBooksSchema } from '~/api';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { Textarea } from '~/components/ui/textarea';
import { useUser } from '~/hooks/use-user';

export const meta = () => {
  return [{ title: 'レビュー投稿 | Book Review App' }];
};

const New = () => {
  const navigate = useNavigate();
  const { data: user, token, isLoading } = useUser();

  const form = useForm<z.infer<typeof postBooksSchema>>({
    resolver: zodResolver(postBooksSchema),
    defaultValues: {
      title: '',
      url: '',
      detail: '',
      review: '',
    },
  });

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login');
    }
  }, [isLoading, user, navigate]);

  const onSubmit = async (reviewForm: z.infer<typeof postBooksSchema>) => {
    try {
      const res = await fetch(new URL('/books', apiBaseUrl), {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(reviewForm),
      });
      if (!res.ok) {
        throw new Error();
      }
      form.reset();
      toast.success('レビューを投稿しました。');
    } catch {
      toast.error('エラーが発生しました。もう一度お試しください。');
    }
  };

  const isSubmitting = form.formState.isSubmitting;

  return (
    <main className='container mx-auto my-12'>
      <Card>
        <CardHeader className='text-center'>
          <CardTitle className='text-2xl font-bold'>レビュー投稿</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
              <FormField
                control={form.control}
                name='title'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>タイトル</FormLabel>
                    <FormControl>
                      <Input {...field} className='md:text-lg' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='url'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL</FormLabel>
                    <FormControl>
                      <Input {...field} className='md:text-lg' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='detail'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>詳細</FormLabel>
                    <FormControl>
                      <Input {...field} className='md:text-lg' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='review'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>レビュー</FormLabel>
                    <FormControl>
                      <Textarea {...field} className='md:text-lg' rows={5} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type='submit'
                className='w-full'
                disabled={isSubmitting || !token}
              >
                送信
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
};

export default New;
