import { atom } from 'nanostores';
import type { z } from 'zod';
import type { getUsersSchema } from '~/api';

export const user = atom<{
  data?: z.infer<typeof getUsersSchema>;
  token?: string;
  isLoading: boolean;
}>({ isLoading: true });
