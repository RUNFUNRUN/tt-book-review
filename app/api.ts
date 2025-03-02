import { z } from 'zod';
import { compressImage } from './lib/compressor';

export const apiBaseUrl = new URL(import.meta.env.VITE_API_BASE_URL);

export const postUsersSchema = z.object({
  token: z.string(),
});

export const postSigninSchema = z.object({
  token: z.string(),
});

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
