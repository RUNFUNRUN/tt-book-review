import { z } from 'zod';
import { compressImage } from './lib/compressor';

export const apiBaseUrl = new URL(import.meta.env.VITE_API_BASE_URL);

export const postUsersSchema = z.object({
  token: z.string(),
});

export const postSigninSchema = z.object({
  token: z.string(),
});

export const bookSchema = z.object({
  id: z.string(),
  title: z.string(),
  url: z.string(),
  detail: z.string(),
  review: z.string(),
  reviewer: z.string(),
  isMine: z.boolean().default(false),
});

export const getBooksSchema = z.array(bookSchema);

export const postUploads = async ({
  token,
  icon,
}: { token: string; icon: File }) => {
  const compressIcon = await compressImage(icon);
  const imageFormData = new FormData();
  imageFormData.append('file', compressIcon);
  return await fetch(new URL('/uploads', apiBaseUrl), {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: imageFormData,
  });
};

export const getUsersSchema = z.object({
  name: z.string(),
  iconUrl: z.string().optional(),
});

export const getUsers = async (token: string) => {
  const res = await fetch(new URL('/users', apiBaseUrl), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    return;
  }
  const parsed = getUsersSchema.safeParse(await res.json());
  return parsed.data;
};

export const putUsersSchema = z.object({
  name: z.string(),
});

export const postBooksSchema = z.object({
  title: z.string(),
  url: z.string().url(),
  detail: z.string(),
  review: z.string(),
});

export const putBooksSchema = z.object({
  title: z.string(),
  url: z.string().url(),
  detail: z.string(),
  review: z.string(),
});
