import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type { Note, Tag, NoteFormData, TagFormData } from '../types';
import { storage } from '../utils/storage';

/**
 * Notes store state interface
 */
interface NotesState {
  // Data
  notes: Note[];
  tags: Tag[];
  selectedNote: Note | null;
  
  // Filters
  searchQuery: string;
  selectedTags: string[];
  
  // Note actions
  addNote: (data: NoteFormData) => Note;
  updateNote: (id: string, updates: Partial<NoteFormData>) => void;
  deleteNote: (id: string) => void;
  selectNote: (note: Note | null) => void;
  
  // Tag actions
  addTag: (data: TagFormData) => void;
  deleteTag: (id: string) => void;
  
  // Filter actions
  setSearchQuery: (query: string) => void;
  setSelectedTags: (tags: string[]) => void;
  toggleTagFilter: (tagId: string) => void;
  
  // Computed
  getFilteredNotes: () => Note[];
  getNoteById: (id: string) => Note | undefined;
}

/**
 * Zustand store for notes management
 * Persists to localStorage automatically
 */
export const useNotesStore = create<NotesState>((set, get) => ({
  // Initialize from localStorage
  notes: storage.getNotes(),
  tags: storage.getTags(),
  selectedNote: null,
  searchQuery: '',
  selectedTags: [],

  /**
   * Add a new note
   */
  addNote: (data: NoteFormData) => {
    const now = new Date().toISOString();
    const newNote: Note = {
      id: uuidv4(),
      title: data.title,
      content: data.content,
      tags: data.tags,
      createdAt: now,
      updatedAt: now,
    };

    set((state) => {
      const updatedNotes = [newNote, ...state.notes];
      storage.setNotes(updatedNotes);
      return { notes: updatedNotes };
    });

    return newNote;
  },

  /**
   * Update an existing note
   */
  updateNote: (id: string, updates: Partial<NoteFormData>) => {
    set((state) => {
      const updatedNotes = state.notes.map((note) =>
        note.id === id
          ? {
              ...note,
              ...updates,
              updatedAt: new Date().toISOString(),
            }
          : note
      );
      storage.setNotes(updatedNotes);
      
      // Update selectedNote if it's the one being edited
      const updatedSelectedNote = state.selectedNote?.id === id
        ? updatedNotes.find((n) => n.id === id) || null
        : state.selectedNote;

      return { notes: updatedNotes, selectedNote: updatedSelectedNote };
    });
  },

  /**
   * Delete a note
   */
  deleteNote: (id: string) => {
    set((state) => {
      const updatedNotes = state.notes.filter((note) => note.id !== id);
      storage.setNotes(updatedNotes);
      
      // Clear selection if deleted note was selected
      const updatedSelectedNote = state.selectedNote?.id === id
        ? null
        : state.selectedNote;

      return { notes: updatedNotes, selectedNote: updatedSelectedNote };
    });
  },

  /**
   * Select a note for viewing/editing
   */
  selectNote: (note: Note | null) => {
    set({ selectedNote: note });
  },

  /**
   * Add a new tag
   */
  addTag: (data: TagFormData) => {
    const newTag: Tag = {
      id: uuidv4(),
      name: data.name,
      color: data.color,
    };

    set((state) => {
      const updatedTags = [...state.tags, newTag];
      storage.setTags(updatedTags);
      return { tags: updatedTags };
    });
  },

  /**
   * Delete a tag and remove it from all notes
   */
  deleteTag: (id: string) => {
    set((state) => {
      const updatedTags = state.tags.filter((tag) => tag.id !== id);
      storage.setTags(updatedTags);

      // Remove tag from all notes
      const updatedNotes = state.notes.map((note) => ({
        ...note,
        tags: note.tags.filter((tagId) => tagId !== id),
      }));
      storage.setNotes(updatedNotes);

      // Remove from selected tags filter
      const updatedSelectedTags = state.selectedTags.filter((tagId) => tagId !== id);

      return {
        tags: updatedTags,
        notes: updatedNotes,
        selectedTags: updatedSelectedTags,
      };
    });
  },

  /**
   * Set search query for filtering notes
   */
  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
  },

  /**
   * Set selected tags for filtering
   */
  setSelectedTags: (tags: string[]) => {
    set({ selectedTags: tags });
  },

  /**
   * Toggle a tag in the filter
   */
  toggleTagFilter: (tagId: string) => {
    set((state) => {
      const isSelected = state.selectedTags.includes(tagId);
      const updatedTags = isSelected
        ? state.selectedTags.filter((id) => id !== tagId)
        : [...state.selectedTags, tagId];
      return { selectedTags: updatedTags };
    });
  },

  /**
   * Get notes filtered by search query and selected tags
   */
  getFilteredNotes: () => {
    const { notes, searchQuery, selectedTags } = get();
    
    return notes.filter((note) => {
      // Filter by search query (title and content)
      const matchesSearch = searchQuery.trim() === '' ||
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase());

      // Filter by selected tags (note must have ALL selected tags)
      const matchesTags = selectedTags.length === 0 ||
        selectedTags.every((tagId) => note.tags.includes(tagId));

      return matchesSearch && matchesTags;
    });
  },

  /**
   * Get a note by ID
   */
  getNoteById: (id: string) => {
    return get().notes.find((note) => note.id === id);
  },
}));
