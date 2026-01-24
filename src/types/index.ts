/**
 * Note interface - Represents a single note
 */
export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Tag interface - Represents a tag for categorizing notes
 */
export interface Tag {
  id: string;
  name: string;
  color: string;
}

/**
 * Note form data - Used for creating/editing notes
 */
export interface NoteFormData {
  title: string;
  content: string;
  tags: string[];
}

/**
 * Tag form data - Used for creating tags
 */
export interface TagFormData {
  name: string;
  color: string;
}

/**
 * Available tag colors for selection
 */
export const TAG_COLORS = [
  '#ef4444', // red
  '#f97316', // orange
  '#eab308', // yellow
  '#22c55e', // green
  '#14b8a6', // teal
  '#3b82f6', // blue
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#6b7280', // gray
] as const;

export type TagColor = typeof TAG_COLORS[number];
