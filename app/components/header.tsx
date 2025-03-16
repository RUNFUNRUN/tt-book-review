import { Link, useLocation } from 'react-router';
import { useUser } from '~/hooks/use-user';
import { cn } from '~/lib/utils';
import { Separator } from './ui/separator';

export const Header = () => {
  const { data: user, isLoading, logout } = useUser();
  const location = useLocation();

  return (
    <header>
      <div className='m-4 flex justify-between'>
        <div>
          <Link to='/' className='text-2xl font-bold'>
            Book Review App
          </Link>
        </div>
        <div className='text-xl'>
          {!isLoading &&
            (user ? (
              <div className='flex gap-4'>
                <Link
                  to='/profile'
                  className={cn(
                    location.pathname === '/profile' && 'font-bold underline',
                  )}
                >
                  {user.name}
                </Link>
                <button type='button' onClick={logout}>
                  ログアウト
                </button>
              </div>
            ) : (
              <div className='flex gap-4'>
                <Link
                  to='/login'
                  className={cn(
                    location.pathname === '/login' && 'font-bold underline',
                  )}
                >
                  ログイン
                </Link>
                <Link
                  to='/signup'
                  className={cn(
                    location.pathname === '/signup' && 'font-bold underline',
                  )}
                >
                  新規登録
                </Link>
              </div>
            ))}
        </div>
      </div>
      <Separator />
    </header>
  );
};
