import { Link } from 'react-router';
import { toast } from 'sonner';
import type { z } from 'zod';
import { apiBaseUrl, type bookSchema } from '~/api';
import { useUser } from '~/hooks/use-user';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

export const BookCard = ({ book }: { book: z.infer<typeof bookSchema> }) => {
  const { token } = useUser();

  const handleLog = async (bookId: string) => {
    try {
      await fetch(new URL('/logs', apiBaseUrl), {
        method: 'POST',
        headers: {
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ selectBookId: bookId }),
      });
    } catch {}
  };

  return (
    <Card className='gap-3'>
      <CardHeader>
        <CardTitle className='underline'>
          {token ? (
            <Link
              to={`/detail/${book.id}`}
              onClick={() => {
                handleLog(book.id);
              }}
            >
              {book.title}
            </Link>
          ) : (
            <button
              type='button'
              onClick={() => toast.warning('ログインしてください。')}
            >
              {book.title}
            </button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='mb-2'>
          <p>{book.detail}</p>
          <p>
            URL:{' '}
            <a
              href={book.url}
              className='underline text-blue-600 hover:text-blue-500'
            >
              {book.url}
            </a>
          </p>
          <p>レビュワー: {book.isMine ? '自分' : book.reviewer}</p>
        </div>
        <p>{book.review}</p>
      </CardContent>
    </Card>
  );
};
