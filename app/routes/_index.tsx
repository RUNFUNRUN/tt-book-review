import { useQuery } from '@tanstack/react-query';
import { apiBaseUrl, getBooksSchema } from '~/api';
import { BookCard } from '~/components/book-card';

export const meta = () => {
  return [{ title: 'Book Review App' }];
};

const Index = () => {
  const token = localStorage.getItem('token');
  const { data: books, isLoading } = useQuery({
    queryKey: ['books'],
    queryFn: async () => {
      if (token) {
        const res = await fetch(new URL('/books', apiBaseUrl), {
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

  return (
    <div className='container mx-auto my-12'>
      <h1 className='text-center mb-8 text-2xl font-bold'>書籍レビュー一覧</h1>
      <div className='space-y-4'>
        {isLoading && <p className='text-center text-xl'>Loading...</p>}
        {books?.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </div>
  );
};

export default Index;
