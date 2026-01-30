import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type { Note, Tag, NoteFormData, TagFormData } from '../types';

/**
 * Notes store state interface
 */
interface NotesState {
  // Data
  notes: Note[];
  tags: Tag[];
  selectedNote: Note | null;
  
  // Computed lookup map for O(1) tag access
  tagsById: Record<string, Tag>;
  
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
  clearFilters: () => void;
}

/**
 * Storage keys for localStorage
 */
const STORAGE_KEY = 'notes-app-storage';

/**
 * Helper to build tagsById lookup map
 */
const buildTagsById = (tags: Tag[]): Record<string, Tag> => {
  return tags.reduce((acc, tag) => {
    acc[tag.id] = tag;
    return acc;
  }, {} as Record<string, Tag>);
};

/**
 * Zustand store for notes management
 * Uses persist middleware for automatic localStorage sync
 * Uses devtools middleware for Redux DevTools integration
 */
export const useNotesStore = create<NotesState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        notes: [],
        tags: [],
        selectedNote: null,
        tagsById: {},
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

          set(
            (state) => ({
              notes: [newNote, ...state.notes],
            }),
            false,
            'addNote'
          );

          return newNote;
        },

        /**
         * Update an existing note
         */
        updateNote: (id: string, updates: Partial<NoteFormData>) => {
          set(
            (state) => {
              const updatedNotes = state.notes.map((note) =>
                note.id === id
                  ? {
                      ...note,
                      ...updates,
                      updatedAt: new Date().toISOString(),
                    }
                  : note
              );

              // Update selectedNote if it's the one being edited
              const updatedSelectedNote =
                state.selectedNote?.id === id
                  ? updatedNotes.find((n) => n.id === id) || null
                  : state.selectedNote;

              return { notes: updatedNotes, selectedNote: updatedSelectedNote };
            },
            false,
            'updateNote'
          );
        },

        /**
         * Delete a note
         */
        deleteNote: (id: string) => {
          set(
            (state) => {
              const updatedNotes = state.notes.filter((note) => note.id !== id);

              // Clear selection if deleted note was selected
              const updatedSelectedNote =
                state.selectedNote?.id === id ? null : state.selectedNote;

              return { notes: updatedNotes, selectedNote: updatedSelectedNote };
            },
            false,
            'deleteNote'
          );
        },

        /**
         * Select a note for viewing/editing
         */
        selectNote: (note: Note | null) => {
          set({ selectedNote: note }, false, 'selectNote');
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

          set(
            (state) => {
              const updatedTags = [...state.tags, newTag];
              return {
                tags: updatedTags,
                tagsById: buildTagsById(updatedTags),
              };
            },
            false,
            'addTag'
          );
        },

        /**
         * Delete a tag and remove it from all notes
         */
        deleteTag: (id: string) => {
          set(
            (state) => {
              const updatedTags = state.tags.filter((tag) => tag.id !== id);

              // Remove tag from all notes
              const updatedNotes = state.notes.map((note) => ({
                ...note,
                tags: note.tags.filter((tagId) => tagId !== id),
              }));

              // Remove from selected tags filter
              const updatedSelectedTags = state.selectedTags.filter(
                (tagId) => tagId !== id
              );

              return {
                tags: updatedTags,
                tagsById: buildTagsById(updatedTags),
                notes: updatedNotes,
                selectedTags: updatedSelectedTags,
              };
            },
            false,
            'deleteTag'
          );
        },

        /**
         * Set search query for filtering notes
         */
        setSearchQuery: (query: string) => {
          set({ searchQuery: query }, false, 'setSearchQuery');
        },

        /**
         * Set selected tags for filtering
         */
        setSelectedTags: (tags: string[]) => {
          set({ selectedTags: tags }, false, 'setSelectedTags');
        },

        /**
         * Toggle a tag in the filter
         */
        toggleTagFilter: (tagId: string) => {
          set(
            (state) => {
              const isSelected = state.selectedTags.includes(tagId);
              const updatedTags = isSelected
                ? state.selectedTags.filter((id) => id !== tagId)
                : [...state.selectedTags, tagId];
              return { selectedTags: updatedTags };
            },
            false,
            'toggleTagFilter'
          );
        },

        /**
         * Clear all filters
         */
        clearFilters: () => {
          set({ searchQuery: '', selectedTags: [] }, false, 'clearFilters');
        },
      }),
      {
        name: STORAGE_KEY,
        // Only persist notes, tags, and tagsById
        partialize: (state) => ({
          notes: state.notes,
          tags: state.tags,
          tagsById: state.tagsById,
        }),
        // Rebuild tagsById on rehydration
        onRehydrateStorage: () => (state) => {
          if (state) {
            state.tagsById = buildTagsById(state.tags);
          }
        },
      }
    ),
    { name: 'NotesStore' }
  )
);

// ============================================================================
// Selectors - Use these for optimized component subscriptions
// ============================================================================

/**
 * Select all notes
 */
export const selectNotes = (state: NotesState) => state.notes;

/**
 * Select all tags
 */
export const selectTags = (state: NotesState) => state.tags;

/**
 * Select tags lookup map
 */
export const selectTagsById = (state: NotesState) => state.tagsById;

/**
 * Select currently selected note
 */
export const selectSelectedNote = (state: NotesState) => state.selectedNote;

/**
 * Select search query
 */
export const selectSearchQuery = (state: NotesState) => state.searchQuery;

/**
 * Select selected tag filters
 */
export const selectSelectedTags = (state: NotesState) => state.selectedTags;

/**
 * Select filtered notes based on search query and selected tags
 * Use this with useMemo in components for optimal performance
 */
export const selectFilteredNotes = (state: NotesState) => {
  const { notes, searchQuery, selectedTags } = state;
  
  // Early return if no filters
  if (searchQuery.trim() === '' && selectedTags.length === 0) {
    return notes;
  }

  const searchLower = searchQuery.toLowerCase().trim();

  return notes.filter((note) => {
    // Filter by search query (title and content)
    const matchesSearch =
      searchLower === '' ||
      note.title.toLowerCase().includes(searchLower) ||
      note.content.toLowerCase().includes(searchLower);

    // Filter by selected tags (note must have ALL selected tags)
    const matchesTags =
      selectedTags.length === 0 ||
      selectedTags.every((tagId) => note.tags.includes(tagId));

    return matchesSearch && matchesTags;
  });
};

/**
 * Create a selector for a specific note by ID
 */
export const selectNoteById = (id: string) => (state: NotesState) =>
  state.notes.find((note) => note.id === id);

/**
 * Create a selector for tags of a specific note
 */
export const selectNoteTagsById = (noteTagIds: string[]) => (state: NotesState) =>
  noteTagIds.map((id) => state.tagsById[id]).filter(Boolean);

// ============================================================================
// Action Selectors - Use these for getting actions without subscribing to state
// ============================================================================

export const selectAddNote = (state: NotesState) => state.addNote;
export const selectUpdateNote = (state: NotesState) => state.updateNote;
export const selectDeleteNote = (state: NotesState) => state.deleteNote;
export const selectSelectNote = (state: NotesState) => state.selectNote;
export const selectAddTag = (state: NotesState) => state.addTag;
export const selectDeleteTag = (state: NotesState) => state.deleteTag;
export const selectSetSearchQuery = (state: NotesState) => state.setSearchQuery;
export const selectToggleTagFilter = (state: NotesState) => state.toggleTagFilter;
export const selectClearFilters = (state: NotesState) => state.clearFilters;
