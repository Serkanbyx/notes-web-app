import type { Note, Tag } from '../types';

const NOTES_KEY = 'notes-app-notes';
const TAGS_KEY = 'notes-app-tags';

/**
 * localStorage helper functions for persisting data
 */
export const storage = {
  /**
   * Get notes from localStorage
   */
  getNotes: (): Note[] => {
    try {
      const data = localStorage.getItem(NOTES_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading notes from localStorage:', error);
      return [];
    }
  },

  /**
   * Save notes to localStorage
   */
  setNotes: (notes: Note[]): void => {
    try {
      localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
    } catch (error) {
      console.error('Error saving notes to localStorage:', error);
    }
  },

  /**
   * Get tags from localStorage
   */
  getTags: (): Tag[] => {
    try {
      const data = localStorage.getItem(TAGS_KEY);
      return data ? JSON.parse(data) : getDefaultTags();
    } catch (error) {
      console.error('Error reading tags from localStorage:', error);
      return getDefaultTags();
    }
  },

  /**
   * Save tags to localStorage
   */
  setTags: (tags: Tag[]): void => {
    try {
      localStorage.setItem(TAGS_KEY, JSON.stringify(tags));
    } catch (error) {
      console.error('Error saving tags to localStorage:', error);
    }
  },

  /**
   * Clear all data from localStorage
   */
  clearAll: (): void => {
    try {
      localStorage.removeItem(NOTES_KEY);
      localStorage.removeItem(TAGS_KEY);
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
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
