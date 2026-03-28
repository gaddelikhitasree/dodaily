import { useState, useEffect, useCallback } from 'react';

export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch {
      /* quota exceeded or private browsing */
    }
  }, [key, storedValue]);

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key !== key || e.newValue === null) return;
      try {
        setStoredValue(JSON.parse(e.newValue));
      } catch {
        /* malformed JSON */
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  const setValue = useCallback(
    (value) => {
      setStoredValue((prev) =>
        typeof value === 'function' ? value(prev) : value
      );
    },
    []
  );

  return [storedValue, setValue];
}
