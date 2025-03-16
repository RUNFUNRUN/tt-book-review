import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { apiBaseUrl, bookSchema } from '~/api';
import { useUser } from '~/hooks/use-user';
import type { Route } from './+types/detail.$book';

const BookDetail = ({ params }: Route.ComponentProps) => {
  const id = params.book;
  const { data: user, token } = useUser();
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
    if (!isLoading && !user) {
      navigate('/login');
    }
  }, [isLoading, user, navigate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <div>{JSON.stringify(book)}</div>;
};

export default BookDetail;
