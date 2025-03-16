import { useStore } from '@nanostores/react';
import { useEffect } from 'react';
import { getUsers } from '~/api';
import { user } from '~/lib/store';
import { useLocalStorage } from './use-local-storage';

export const useUser = () => {
  const [token, setToken] = useLocalStorage('token');

  const $user = useStore(user);

  useEffect(() => {
    (async () => {
      if (token === undefined) {
        return;
      }
      if (token === '') {
        user.set({ isLoading: false });
        return;
      }

      user.set({ isLoading: true });
      const response = await getUsers(token);
      if (response) {
        user.set({ data: response, token, isLoading: false });
        setToken(token);
        return;
      }
      setToken('');
      user.set({ isLoading: false });
    })();
  }, [token, setToken]);

  const refetch = async () => {
    if (token === undefined) {
      return;
    }
    if (token === '') {
      user.set({ isLoading: false });
      return;
    }

    user.set({ isLoading: true });
    const response = await getUsers(token);
    if (response) {
      user.set({ data: response, token, isLoading: false });
      setToken(token);
      return;
    }
    setToken('');
    user.set({ isLoading: false });
  };

  const logout = () => {
    setToken('');
    user.set({ isLoading: false });
  };

  return { ...$user, setToken, logout, refetch };
};
