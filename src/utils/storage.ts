import type { Note, Tag } from '../types';

const NOTES_KEY = 'notes-app-notes';
const TAGS_KEY = 'notes-app-tags';

/**
 * Storage operation result
 */
export interface StorageResult<T> {
  success: boolean;
  data?: T;
  error?: StorageError;
}

/**
 * Storage error
 */
export interface StorageError {
  type: 'quota_exceeded' | 'parse_error' | 'write_error' | 'read_error';
  message: string;
}

/**
 * Check if localStorage is available (SSR safety)
 */
const isStorageAvailable = (): boolean => {
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
 * Get approximate storage usage
 */
export const getStorageUsage = (): { used: number; total: number; percentage: number } => {
  if (!isStorageAvailable()) {
    return { used: 0, total: 0, percentage: 0 };
  }

  let used = 0;
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key) {
      const value = localStorage.getItem(key);
      if (value) {
        used += key.length + value.length;
      }
    }
  }

  // Convert to bytes (UTF-16 = 2 bytes per character)
  used *= 2;

  // Approximate total (5MB is common limit)
  const total = 5 * 1024 * 1024;

  return {
    used,
    total,
    percentage: Math.round((used / total) * 100),
  };
};

/**
 * Check if there's enough space for new data
 */
export const hasEnoughSpace = (dataSize: number): boolean => {
  const { used, total } = getStorageUsage();
  // Leave 10% buffer
  return used + dataSize < total * 0.9;
};

/**
 * localStorage helper functions for persisting data
 */
export const storage = {
  /**
   * Check if storage is available
   */
  isAvailable: isStorageAvailable,

  /**
   * Get storage usage info
   */
  getUsage: getStorageUsage,

  /**
   * Get notes from localStorage
   */
  getNotes: (): StorageResult<Note[]> => {
    if (!isStorageAvailable()) {
      return { success: false, data: [], error: { type: 'read_error', message: 'localStorage kullanılamıyor' } };
    }

    try {
      const data = localStorage.getItem(NOTES_KEY);
      const notes = data ? JSON.parse(data) : [];
      
      // Validate that it's an array
      if (!Array.isArray(notes)) {
        return { success: false, data: [], error: { type: 'parse_error', message: 'Geçersiz not verisi' } };
      }
      
      return { success: true, data: notes };
    } catch (error) {
      console.error('Error reading notes from localStorage:', error);
      return { success: false, data: [], error: { type: 'read_error', message: 'Notlar okunamadı' } };
    }
  },

  /**
   * Save notes to localStorage
   */
  setNotes: (notes: Note[]): StorageResult<void> => {
    if (!isStorageAvailable()) {
      return { success: false, error: { type: 'write_error', message: 'localStorage kullanılamıyor' } };
    }

    try {
      const dataString = JSON.stringify(notes);
      
      // Check if there's enough space
      if (!hasEnoughSpace(dataString.length * 2)) {
        return { success: false, error: { type: 'quota_exceeded', message: 'Depolama alanı dolu' } };
      }
      
      localStorage.setItem(NOTES_KEY, dataString);
      return { success: true };
    } catch (error) {
      console.error('Error saving notes to localStorage:', error);
      
      if (isQuotaExceeded(error)) {
        return { success: false, error: { type: 'quota_exceeded', message: 'Depolama alanı dolu. Lütfen bazı notları silin.' } };
      }
      
      return { success: false, error: { type: 'write_error', message: 'Notlar kaydedilemedi' } };
    }
  },

  /**
   * Get tags from localStorage
   */
  getTags: (): StorageResult<Tag[]> => {
    if (!isStorageAvailable()) {
      return { success: true, data: getDefaultTags() };
    }

    try {
      const data = localStorage.getItem(TAGS_KEY);
      if (!data) {
        return { success: true, data: getDefaultTags() };
      }
      
      const tags = JSON.parse(data);
      
      // Validate that it's an array
      if (!Array.isArray(tags)) {
        return { success: false, data: getDefaultTags(), error: { type: 'parse_error', message: 'Geçersiz etiket verisi' } };
      }
      
      return { success: true, data: tags };
    } catch (error) {
      console.error('Error reading tags from localStorage:', error);
      return { success: true, data: getDefaultTags() };
    }
  },

  /**
   * Save tags to localStorage
   */
  setTags: (tags: Tag[]): StorageResult<void> => {
    if (!isStorageAvailable()) {
      return { success: false, error: { type: 'write_error', message: 'localStorage kullanılamıyor' } };
    }

    try {
      localStorage.setItem(TAGS_KEY, JSON.stringify(tags));
      return { success: true };
    } catch (error) {
      console.error('Error saving tags to localStorage:', error);
      
      if (isQuotaExceeded(error)) {
        return { success: false, error: { type: 'quota_exceeded', message: 'Depolama alanı dolu' } };
      }
      
      return { success: false, error: { type: 'write_error', message: 'Etiketler kaydedilemedi' } };
    }
  },

  /**
   * Clear all data from localStorage
   */
  clearAll: (): StorageResult<void> => {
    if (!isStorageAvailable()) {
      return { success: false, error: { type: 'write_error', message: 'localStorage kullanılamıyor' } };
    }

    try {
      localStorage.removeItem(NOTES_KEY);
      localStorage.removeItem(TAGS_KEY);
      return { success: true };
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return { success: false, error: { type: 'write_error', message: 'Veriler temizlenemedi' } };
    }
  },

  /**
   * Export all data as JSON
   */
  exportData: (): StorageResult<{ notes: Note[]; tags: Tag[] }> => {
    const notesResult = storage.getNotes();
    const tagsResult = storage.getTags();

    if (!notesResult.success || !tagsResult.success) {
      return { success: false, error: { type: 'read_error', message: 'Veriler okunamadı' } };
    }

    return {
      success: true,
      data: {
        notes: notesResult.data || [],
        tags: tagsResult.data || [],
      },
    };
  },

  /**
   * Import data from JSON
   */
  importData: (data: { notes?: Note[]; tags?: Tag[] }): StorageResult<void> => {
    if (data.notes) {
      const notesResult = storage.setNotes(data.notes);
      if (!notesResult.success) return notesResult;
    }

    if (data.tags) {
      const tagsResult = storage.setTags(data.tags);
      if (!tagsResult.success) return tagsResult;
    }

    return { success: true };
  },
};

/**
 * Default tags for new users
 */
function getDefaultTags(): Tag[] {
  return [
    { id: 'tag-1', name: 'Kişisel', color: '#3b82f6' },
    { id: 'tag-2', name: 'İş', color: '#22c55e' },
    { id: 'tag-3', name: 'Fikir', color: '#eab308' },
    { id: 'tag-4', name: 'Önemli', color: '#ef4444' },
  ];
}
