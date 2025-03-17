import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { apiBaseUrl, bookSchema } from '~/api';
import { Button } from '~/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import { useUser } from '~/hooks/use-user';
import type { Route } from './+types/detail.$book';

export const meta = () => {
  return [{ title: 'レビュー詳細 | Book Review App' }];
};

const BookDetail = ({ params }: Route.ComponentProps) => {
  const id = params.book;
  const { data: user, isLoading: isLoadingUser, token } = useUser();
  const navigate = useNavigate();

  const {
    data: book,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [`book-${id}`],
    queryFn: async () => {
      if (!token) {
        throw new Error('Unauthorized');
      }
      const res = await fetch(new URL(`/books/${id}`, apiBaseUrl), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const parsed = bookSchema.safeParse(await res.json());
      if (!parsed.success) {
        throw new Error('Failed to parse response');
      }

      return parsed.data;
    },
    enabled: !!token,
  });

  // biome-ignore lint:
  useEffect(() => {
    refetch();
  }, [user]);

  useEffect(() => {
    if (!isLoadingUser && !user) {
      navigate('/login');
    }
  }, [isLoadingUser, user, navigate]);

  return (
    <main className='container pt-20 mx-auto'>
      {(isLoadingUser || isLoading) && (
        <p className='text-center'>Loading...</p>
      )}
      {book && (
        <Card>
          <CardHeader>
            <div className='sm:flex justify-between'>
              <CardTitle className='text-2xl'>{book.title}</CardTitle>
              <span className='block'>
                {book.isMine ? (
                  <Link to={`/edit/${book.id}`}>
                    <Button>編集</Button>
                  </Link>
                ) : (
                  `レビュワー: ${book.reviewer}`
                )}
              </span>
            </div>
            <CardDescription className='text-black text-xl'>
              <a href={book.url} className='underline block'>
                {book.url}
              </a>
            </CardDescription>
          </CardHeader>
          <CardContent className='text-xl'>
            <p>{book.detail}</p>
            <p>{book.review}</p>
          </CardContent>
        </Card>
      )}
    </main>
  );
};

export default BookDetail;
