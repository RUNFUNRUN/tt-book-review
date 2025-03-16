import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { EditUser } from '~/components/edit-user';
import { useUser } from '~/hooks/use-user';

export const meta = () => {
  return [{ title: 'ユーザー情報編集 | Book Review App' }];
};

const Profile = () => {
  const navigate = useNavigate();
  const { data: user, token, isLoading, refetch } = useUser();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login');
    }
  }, [isLoading, user, navigate]);

  return (
    <main className='pt-20'>
      {isLoading ? (
        <p className='text-center'>Loading...</p>
      ) : (
        user &&
        token && <EditUser user={user} token={token} refetch={refetch} />
      )}
    </main>
  );
};

export default Profile;
