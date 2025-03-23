import { zodResolver } from '@hookform/resolvers/zod';
import type {
  QueryObserverResult,
  RefetchOptions,
} from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';
import { apiBaseUrl, type bookSchema, putBooksSchema } from '~/api';
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
import { Textarea } from './ui/textarea';

export const EditBook = ({
  book,
  token,
  refetch,
}: {
  book: z.infer<typeof bookSchema>;
  token: string;
  refetch: (option?: RefetchOptions) => Promise<QueryObserverResult>;
}) => {
  const form = useForm<z.infer<typeof putBooksSchema>>({
    resolver: zodResolver(putBooksSchema),
    defaultValues: {
      ...book,
    },
  });

  const onSubmit = async (editForm: z.infer<typeof putBooksSchema>) => {
    try {
      const res = await fetch(new URL(`/books/${book.id}`, apiBaseUrl), {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editForm),
      });
      if (!res.ok) {
        throw new Error();
      }
      await refetch();
      form.reset();
      toast.success('レビューを更新しました。');
    } catch {
      toast.error('エラーが発生しました。もう一度お試しください。');
    }
  };

  const isSubmitting = form.formState.isSubmitting;

  return (
    <Card>
      <CardHeader className='text-center'>
        <CardTitle className='text-2xl font-bold'>レビュー編集</CardTitle>
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
            <Button type='submit' className='w-full' disabled={isSubmitting}>
              送信
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
