import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { apiBaseUrl, bookSchema } from '~/api';
import { EditBook } from '~/components/edit-book';
import { useUser } from '~/hooks/use-user';
import type { Route } from './+types/edit.$book';

export const meta = () => {
  return [{ title: 'レビュー編集 | Book Review App' }];
};

const Edit = ({ params }: Route.ComponentProps) => {
  const id = params.book;
  const { data: user, isLoading: isLoadingUser, token } = useUser();
  const navigate = useNavigate();

  const {
    data: book,
    isFetching,
    refetch,
    error,
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

  useEffect(() => {
    if (error) {
      navigate('/login');
    }
  }, [error, navigate]);

  // biome-ignore lint:
  useEffect(() => {
    refetch();
  }, [user]);

  useEffect(() => {
    if (book && !book.isMine) {
      navigate('/');
    }
  }, [book, navigate]);

  useEffect(() => {
    if (!isLoadingUser && !user) {
      navigate('/login');
    }
  }, [isLoadingUser, user, navigate]);

  return (
    <main className='container pt-20 mx-auto'>
      {isFetching ? (
        <p className='text-center'>Loading...</p>
      ) : (
        user &&
        book &&
        book.isMine &&
        token && <EditBook token={token} book={book} refetch={refetch} />
      )}
    </main>
  );
};

export default Edit;
