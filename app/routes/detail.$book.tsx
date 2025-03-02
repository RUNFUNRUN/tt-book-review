import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { apiBaseUrl, bookSchema } from '~/api';
import type { Route } from './+types/detail.$book';

const BookDetail = ({ params }: Route.ComponentProps) => {
  const id = params.book;
  const token = localStorage.getItem('token');
  const { data: book, isLoading } = useQuery({
    queryKey: [`book-${id}`],
    queryFn: async () => {
      if (token) {
        const res = await fetch(new URL('/books', apiBaseUrl), {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const parsed = bookSchema.safeParse(await res.json());
        if (!parsed.success) {
          throw new Error('Failed to parse response');
        }
        return parsed.data;
      }
    },
  });
  const navigate = useNavigate();

  if (!token) {
    navigate('/login');
  }

  return <div>{id}</div>;
};

export default BookDetail;
