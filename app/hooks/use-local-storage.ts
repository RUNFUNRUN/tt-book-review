import { useCallback, useEffect, useState } from 'react';

export const useLocalStorage = (key: string) => {
  const [value, setValue] = useState<string | undefined>(() => {
    if (typeof window === 'undefined') return;
    return localStorage.getItem(key) ?? '';
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = localStorage.getItem(key);
    if (stored !== null) {
      setValue(stored);
    }
  }, [key]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleStorage = (event: StorageEvent) => {
      if (event.key === key) {
        setValue(localStorage.getItem(key) ?? undefined);
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [key]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleCustomStorage = () => {
      setValue(localStorage.getItem(key) ?? undefined);
    };
    window.addEventListener(`local-storage-${key}`, handleCustomStorage);
    return () =>
      window.removeEventListener(`local-storage-${key}`, handleCustomStorage);
  }, [key]);

  const setLocalStorageValue = useCallback(
    (newValue: string | ((prevValue: string | undefined) => string)) => {
      if (typeof window === 'undefined') return;
      setValue((prev) => {
        const computedValue =
          typeof newValue === 'function' ? newValue(prev) : newValue;
        localStorage.setItem(key, computedValue);
        setTimeout(() => {
          window.dispatchEvent(new Event(`local-storage-${key}`));
        }, 0);
        return computedValue ?? '';
      });
    },
    [key],
  );

  return [value, setLocalStorageValue] as const;
};
