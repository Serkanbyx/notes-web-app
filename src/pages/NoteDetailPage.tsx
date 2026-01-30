import { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  useNotesStore,
  selectNoteById,
  selectAddNote,
  selectUpdateNote,
  selectDeleteNote,
} from '../store/useNotesStore';
import { useAutoSave } from '../hooks/useAutoSave';
import type { NoteSchemaType } from '../utils/validation';
import NoteForm from '../components/notes/NoteForm';
import Button from '../components/ui/Button';

/**
 * Note detail page - for viewing, editing, and creating notes
 * Supports dark mode
 */
function NoteDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Use selectors for optimized subscriptions
  const addNote = useNotesStore(selectAddNote);
  const updateNote = useNotesStore(selectUpdateNote);
  const deleteNote = useNotesStore(selectDeleteNote);

  // Create memoized selector for the specific note
  const noteSelector = useMemo(
    () => (id && id !== 'new' ? selectNoteById(id) : () => undefined),
    [id]
  );
  const existingNote = useNotesStore(noteSelector);

  const isNewNote = !id || id === 'new';

  const [formData, setFormData] = useState<NoteSchemaType>({
    title: existingNote?.title || '',
    content: existingNote?.content || '',
    tags: existingNote?.tags || [],
  });

  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>(
    'saved'
  );
  const hasCreatedNote = useRef(false);
  const createdNoteId = useRef<string | null>(null);

  // Update form data when note changes
  useEffect(() => {
    if (existingNote) {
      setFormData({
        title: existingNote.title,
        content: existingNote.content,
        tags: existingNote.tags,
      });
    } else if (isNewNote) {
      setFormData({ title: '', content: '', tags: [] });
      hasCreatedNote.current = false;
      createdNoteId.current = null;
    }
  }, [existingNote, isNewNote]);

  // Auto-save callback
  const handleAutoSave = useCallback(
    (data: NoteSchemaType) => {
      // Don't save if title is empty
      if (!data.title.trim()) {
        return;
      }

      setSaveStatus('saving');

      if (isNewNote && !hasCreatedNote.current) {
        // Create new note
        const newNote = addNote({
          title: data.title,
          content: data.content,
          tags: data.tags,
        });
        hasCreatedNote.current = true;
        createdNoteId.current = newNote.id;
        // Navigate to the new note's URL without adding to history
        navigate(`/note/${newNote.id}`, { replace: true });
      } else {
        // Update existing note
        const noteId = createdNoteId.current || id;
        if (noteId) {
          updateNote(noteId, data);
        }
      }

      setTimeout(() => setSaveStatus('saved'), 500);
    },
    [isNewNote, id, addNote, updateNote, navigate]
  );

  // Use auto-save hook
  const { saveNow } = useAutoSave(handleAutoSave, formData, 1000);

  // Handle form changes
  const handleFormChange = useCallback((data: NoteSchemaType) => {
    setFormData(data);
    if (data.title.trim()) {
      setSaveStatus('unsaved');
    }
  }, []);

  // Handle delete
  const handleDelete = useCallback(() => {
    const noteId = createdNoteId.current || id;
    // TODO: Replace with accessible modal in a11y phase
    if (noteId && window.confirm('Bu notu silmek istediğinize emin misiniz?')) {
      deleteNote(noteId);
      navigate('/');
    }
  }, [id, deleteNote, navigate]);

  // Handle form submit (not used with autosave, but required by form)
  const handleSubmit = useCallback(
    (data: NoteSchemaType) => {
      setFormData(data);
      saveNow();
    },
    [saveNow]
  );

  // Handle back navigation
  const handleBack = useCallback(() => {
    navigate('/');
  }, [navigate]);

  // If note not found and not new
  if (!isNewNote && !existingNote) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-white dark:bg-gray-900">
        <svg
          className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Not bulunamadı
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          Aradığınız not mevcut değil veya silinmiş olabilir.
        </p>
        <Button onClick={handleBack}>Ana Sayfaya Dön</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        <div className="flex items-center gap-4">
          {/* Back button for mobile */}
          <button
            onClick={handleBack}
            className="lg:hidden p-2 -ml-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100
                       focus:outline-none focus:ring-2 focus:ring-primary-500 rounded"
            aria-label="Geri dön"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          {/* Save status indicator */}
          <div className="flex items-center gap-2 text-sm" aria-live="polite">
            {saveStatus === 'saving' && (
              <>
                <svg
                  className="w-4 h-4 text-yellow-500 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span className="text-yellow-600 dark:text-yellow-400">
                  Kaydediliyor...
                </span>
              </>
            )}
            {saveStatus === 'saved' && formData.title.trim() && (
              <>
                <svg
                  className="w-4 h-4 text-green-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-green-600 dark:text-green-400">
                  Kaydedildi
                </span>
              </>
            )}
            {saveStatus === 'unsaved' && (
              <>
                <svg
                  className="w-4 h-4 text-gray-400 dark:text-gray-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-gray-500 dark:text-gray-400">
                  Kaydedilmemiş değişiklikler
                </span>
              </>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {(!isNewNote || hasCreatedNote.current) && (
            <Button variant="danger" size="sm" onClick={handleDelete}>
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              Sil
            </Button>
          )}
        </div>
      </header>

      {/* Form */}
      <div className="flex-1 overflow-y-auto p-6">
        <NoteForm
          initialData={formData}
          onSubmit={handleSubmit}
          onChange={handleFormChange}
        />
      </div>
    </div>
  );
}

export default NoteDetailPage;
