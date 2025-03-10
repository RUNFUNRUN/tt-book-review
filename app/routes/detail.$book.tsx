import { useQuery } from '@tanstack/react-query';
import { apiBaseUrl, bookSchema } from '~/api';
import { useLocalStorage } from '~/hooks/use-local-storage';
import type { Route } from './+types/detail.$book';

const BookDetail = ({ params }: Route.ComponentProps) => {
  const id = params.book;
  const [token] = useLocalStorage('token');

  const { data: book, isLoading } = useQuery({
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
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <div>{JSON.stringify(book)}</div>;
};

export default BookDetail;
