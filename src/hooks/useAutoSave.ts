import { useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook for debounced auto-save functionality
 * @param callback - Function to call when auto-save triggers
 * @param delay - Debounce delay in milliseconds (default: 1000ms)
 * @param deps - Dependencies that trigger the auto-save
 */
export function useAutoSave<T>(
  callback: (data: T) => void,
  data: T,
  delay: number = 1000
) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const callbackRef = useRef(callback);
  const dataRef = useRef(data);

  // Update refs on each render
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  // Debounced save function
  useEffect(() => {
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      callbackRef.current(dataRef.current);
    }, delay);

    // Cleanup on unmount or before next effect
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, delay]);

  // Force save immediately (useful for save button)
  const saveNow = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    callbackRef.current(dataRef.current);
  }, []);

  // Cancel pending save
  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  return { saveNow, cancel };
}

export default useAutoSave;
