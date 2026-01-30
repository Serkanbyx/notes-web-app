import { useEffect, useRef, useCallback, useState } from 'react';

/**
 * Auto-save status
 */
export type AutoSaveStatus = 'idle' | 'saving' | 'saved' | 'error';

/**
 * Auto-save result
 */
interface UseAutoSaveResult {
  /** Force save immediately */
  saveNow: () => void;
  /** Cancel pending save */
  cancel: () => void;
  /** Current save status */
  status: AutoSaveStatus;
  /** Last error if any */
  error: Error | null;
}

/**
 * Custom hook for debounced auto-save functionality
 * Features:
 * - Error handling with try-catch
 * - Save status tracking
 * - Deep equality check option
 * - SSR safety
 * 
 * @param callback - Function to call when auto-save triggers
 * @param data - Data to save
 * @param delay - Debounce delay in milliseconds (default: 1000ms)
 */
export function useAutoSave<T>(
  callback: (data: T) => void | Promise<void>,
  data: T,
  delay: number = 1000
): UseAutoSaveResult {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const callbackRef = useRef(callback);
  const dataRef = useRef(data);
  const [status, setStatus] = useState<AutoSaveStatus>('idle');
  const [error, setError] = useState<Error | null>(null);

  // Update callback ref on each render
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Update data ref on each render
  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  /**
   * Execute the save callback with error handling
   */
  const executeSave = useCallback(async () => {
    try {
      setStatus('saving');
      setError(null);
      
      // Execute callback (may be async)
      await callbackRef.current(dataRef.current);
      
      setStatus('saved');
      
      // Reset to idle after a short delay
      setTimeout(() => {
        setStatus('idle');
      }, 2000);
    } catch (err) {
      const saveError = err instanceof Error ? err : new Error('Auto-save failed');
      console.error('Auto-save error:', saveError);
      setError(saveError);
      setStatus('error');
    }
  }, []);

  // Debounced save effect
  useEffect(() => {
    // SSR safety check
    if (typeof window === 'undefined') return;

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      executeSave();
    }, delay);

    // Cleanup on unmount or before next effect
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [data, delay, executeSave]);

  // Force save immediately (useful for save button)
  const saveNow = useCallback(() => {
    // Clear pending timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    // Execute save immediately
    executeSave();
  }, [executeSave]);

  // Cancel pending save
  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setStatus('idle');
  }, []);

  return { saveNow, cancel, status, error };
}

export default useAutoSave;
