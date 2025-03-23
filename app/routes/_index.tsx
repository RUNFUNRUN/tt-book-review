import { useQuery } from '@tanstack/react-query';
import { Link, useSearchParams } from 'react-router';
import { z } from 'zod';
import { apiBaseUrl, getBooksSchema } from '~/api';
import { BookCard } from '~/components/book-card';
import { Button } from '~/components/ui/button';
import { useUser } from '~/hooks/use-user';

export const meta = () => {
  return [
    { title: 'Book Review App' },
    {
      name: 'description',
      content: 'TechTrain React.js 基礎3 書籍レビューアプリ',
    },
  ];
};

const Index = () => {
  const { token } = useUser();
  const [searchParams] = useSearchParams();
  const rawPage = searchParams.get('page') ?? '1';
  const parsedPage = z.coerce.number().safeParse(rawPage);
  const page = parsedPage.data ?? 1;

  const { data: books, isLoading } = useQuery({
    queryKey: [`books-${page}`],
    queryFn: async () => {
      if (token) {
        const offset = (page - 1) * 10;
        const query = new URLSearchParams();
        query.set('offset', offset.toString());
        const res = await fetch(new URL(`/books?${query}`, apiBaseUrl), {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const parsed = getBooksSchema.safeParse(await res.json());
        if (!parsed.success) {
          throw new Error('Failed to parse response');
        }
        return parsed.data;
      }
      const res = await fetch(new URL('/public/books', apiBaseUrl));
      const parsed = getBooksSchema.safeParse(await res.json());
      if (!parsed.success) {
        throw new Error('Failed to parse response');
      }
      return parsed.data;
    },
  });

  const prevParam = new URLSearchParams();
  prevParam.set('page', (page - 1).toString());
  const nextParam = new URLSearchParams();
  nextParam.set('page', (page + 1).toString());

  return (
    <main className='container mx-auto my-12 space-y-8'>
      <h1 className='text-center text-2xl font-bold'>書籍レビュー一覧</h1>
      <div className='space-y-4'>
        {isLoading ? (
          <p className='text-center text-xl'>Loading...</p>
        ) : (
          books &&
          (books.length === 0 ? (
            <p className='text-center text-xl'>データがありません。</p>
          ) : (
            books.map((book) => <BookCard key={book.id} book={book} />)
          ))
        )}
      </div>
      <div className='flex justify-center gap-4'>
        {books && page !== 1 && (
          <Link to={`/?${prevParam}`} className='block'>
            <Button>前へ</Button>
          </Link>
        )}
        {books && books.length === 10 && (
          <Link to={`/?${nextParam}`} className='block'>
            <Button>次へ</Button>
          </Link>
        )}
      </div>
    </main>
  );
};

export default Index;
