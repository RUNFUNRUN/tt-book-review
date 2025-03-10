import { useCallback, useEffect, useState } from 'react';

export const useLocalStorage = (key: string, initValue = '') => {
  const [value, setValue] = useState(initValue);

  // クライアント側でマウント後に localStorage の値を読み込む
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(key);
      if (stored !== null) {
        setValue(stored);
      }
    }
  }, [key]);

  // 他タブでの変更を検知するための storage イベント
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleStorage = (event: StorageEvent) => {
      if (event.key === key) {
        setValue(localStorage.getItem(key) ?? initValue);
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [key, initValue]);

  // 同一タブ内での更新を検知するためのカスタムイベント
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleCustomStorage = () => {
      setValue(localStorage.getItem(key) ?? initValue);
    };
    window.addEventListener(`local-storage-${key}`, handleCustomStorage);
    return () =>
      window.removeEventListener(`local-storage-${key}`, handleCustomStorage);
  }, [key, initValue]);

  // localStorage を更新し、カスタムイベントを非同期で発火
  const setLocalStorageValue = useCallback(
    (newValue: string | ((prevValue: string) => string)) => {
      if (typeof window === 'undefined') return;
      setValue((prev) => {
        const computedValue =
          typeof newValue === 'function' ? newValue(prev) : newValue;
        localStorage.setItem(key, computedValue);
        // dispatchEvent を非同期にすることでレンダリング中の更新を回避
        setTimeout(() => {
          window.dispatchEvent(new Event(`local-storage-${key}`));
        }, 0);
        return computedValue;
      });
    },
    [key],
  );

  return [value, setLocalStorageValue] as const;
};
