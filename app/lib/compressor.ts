import Compressor from 'compressorjs';

export const compressImage = (file: File): Promise<File | Blob> => {
  return new Promise((resolve, reject) => {
    new Compressor(file, {
      maxWidth: 2000,
      maxHeight: 2000,
      success(result) {
        resolve(result);
      },
      error(err) {
        reject(err);
      },
    });
  });
};
