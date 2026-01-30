import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Storage error types
 */
export type StorageErrorType = 'quota_exceeded' | 'parse_error' | 'write_error' | 'read_error';

/**
 * Storage error
 */
export interface StorageError {
  type: StorageErrorType;
  message: string;
  originalError?: Error;
}

/**
 * Storage result
 */
interface UseLocalStorageResult<T> {
  /** Current stored value */
  value: T;
  /** Set new value */
  setValue: (value: T | ((val: T) => T)) => void;
  /** Remove value from storage */
  removeValue: () => void;
  /** Last error if any */
  error: StorageError | null;
  /** Whether storage is available */
  isAvailable: boolean;
}

/**
 * Check if localStorage is available
 */
const isLocalStorageAvailable = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  try {
    const testKey = '__storage_test__';
    window.localStorage.setItem(testKey, testKey);
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
};

/**
 * Check if error is QuotaExceededError
 */
const isQuotaExceeded = (error: unknown): boolean => {
  return (
    error instanceof DOMException &&
    (error.name === 'QuotaExceededError' ||
      error.name === 'NS_ERROR_DOM_QUOTA_REACHED' ||
      error.code === 22 ||
      error.code === 1014)
  );
};

/**
 * Custom hook for syncing state with localStorage
 * Features:
 * - SSR safety
 * - QuotaExceededError handling
 * - Cross-tab synchronization (including deletions)
 * - Error tracking
 * 
 * @param key - localStorage key
 * @param initialValue - Initial value if key doesn't exist
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): UseLocalStorageResult<T> {
  const [isAvailable] = useState(isLocalStorageAvailable);
  const [error, setError] = useState<StorageError | null>(null);
  const initialValueRef = useRef(initialValue);

  // Get initial value from localStorage or use provided initial value
  const [storedValue, setStoredValue] = useState<T>(() => {
    // SSR safety
    if (typeof window === 'undefined') return initialValue;
    if (!isAvailable) return initialValue;

    try {
      const item = localStorage.getItem(key);
      if (item === null) return initialValue;
      
      return JSON.parse(item) as T;
    } catch (err) {
      console.error(`Error reading localStorage key "${key}":`, err);
      setError({
        type: 'read_error',
        message: `localStorage'dan okuma hatası: ${key}`,
        originalError: err instanceof Error ? err : undefined,
      });
      return initialValue;
    }
  });

  // Update localStorage when state changes
  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        // Allow value to be a function (like useState)
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;

        // Update state first
        setStoredValue(valueToStore);
        setError(null);

        // SSR safety
        if (typeof window === 'undefined' || !isAvailable) return;

        // Try to save to localStorage
        localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (err) {
        if (isQuotaExceeded(err)) {
          console.error(`localStorage quota exceeded for key "${key}"`);
          setError({
            type: 'quota_exceeded',
            message: 'Depolama alanı dolu. Lütfen bazı notları silin.',
            originalError: err instanceof Error ? err : undefined,
          });
        } else {
          console.error(`Error setting localStorage key "${key}":`, err);
          setError({
            type: 'write_error',
            message: `localStorage'a yazma hatası: ${key}`,
            originalError: err instanceof Error ? err : undefined,
          });
        }
      }
    },
    [key, storedValue, isAvailable]
  );

  // Remove item from localStorage
  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValueRef.current);
      setError(null);

      // SSR safety
      if (typeof window === 'undefined' || !isAvailable) return;

      localStorage.removeItem(key);
    } catch (err) {
      console.error(`Error removing localStorage key "${key}":`, err);
      setError({
        type: 'write_error',
        message: `localStorage'dan silme hatası: ${key}`,
        originalError: err instanceof Error ? err : undefined,
      });
    }
  }, [key, isAvailable]);

  // Listen for changes in other tabs/windows (including deletions)
  useEffect(() => {
    // SSR safety
    if (typeof window === 'undefined' || !isAvailable) return;

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key !== key) return;

      try {
        if (e.newValue === null) {
          // Item was deleted in another tab
          setStoredValue(initialValueRef.current);
        } else {
          // Item was updated in another tab
          setStoredValue(JSON.parse(e.newValue) as T);
        }
        setError(null);
      } catch (err) {
        console.error(`Error parsing storage event for key "${key}":`, err);
        setError({
          type: 'parse_error',
          message: `Veri ayrıştırma hatası: ${key}`,
          originalError: err instanceof Error ? err : undefined,
        });
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key, isAvailable]);

  return {
    value: storedValue,
    setValue,
    removeValue,
    error,
    isAvailable,
  };
}

export default useLocalStorage;
