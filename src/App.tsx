import { lazy, Suspense, useCallback, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import SplitLayout from './components/layout/SplitLayout';
import PageLoader from './components/ui/PageLoader';
import KeyboardShortcutsModal from './components/ui/KeyboardShortcutsModal';
import {
  useKeyboardShortcuts,
  useAppKeyboardShortcuts,
} from './hooks/useKeyboardShortcuts';
import {
  useUIStore,
  selectIsShortcutsModalOpen,
  selectOpenShortcutsModal,
  selectCloseShortcutsModal,
} from './store/useUIStore';

// Lazy load pages for code splitting
const NotesListPage = lazy(() => import('./pages/NotesListPage'));
const NoteDetailPage = lazy(() => import('./pages/NoteDetailPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

/**
 * Main application component
 * Handles routing, layout structure, and global keyboard shortcuts
 */
function App() {
  const navigate = useNavigate();
  const location = useLocation();

  // UI store for modal state
  const isShortcutsModalOpen = useUIStore(selectIsShortcutsModalOpen);
  const openShortcutsModal = useUIStore(selectOpenShortcutsModal);
  const closeShortcutsModal = useUIStore(selectCloseShortcutsModal);

  // Focus search input when Ctrl+F is pressed
  const handleSearch = useCallback(() => {
    // Find the search input in the sidebar
    const searchInput = document.querySelector(
      'input[aria-label="Notlarda ara"]'
    ) as HTMLInputElement;
    if (searchInput) {
      searchInput.focus();
      searchInput.select();
    }
  }, []);

  // Navigate to new note
  const handleNewNote = useCallback(() => {
    navigate('/note/new');
  }, [navigate]);

  // Create keyboard shortcuts
  const shortcuts = useAppKeyboardShortcuts({
    onNewNote: handleNewNote,
    onSearch: handleSearch,
    onShowShortcuts: openShortcutsModal,
    // Save and delete are handled at the page level
    // Editor modes are handled at the editor level
  });

  // Enable global keyboard shortcuts
  useKeyboardShortcuts(shortcuts);

  // Close modal on route change
  useEffect(() => {
    closeShortcutsModal();
  }, [location.pathname, closeShortcutsModal]);

  return (
    <>
      <SplitLayout>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<NotesListPage />} />
            <Route path="/note/new" element={<NoteDetailPage />} />
            <Route path="/note/:id" element={<NoteDetailPage />} />
            {/* 404 route */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </SplitLayout>

      {/* Keyboard shortcuts modal */}
      <KeyboardShortcutsModal
        isOpen={isShortcutsModalOpen}
        onClose={closeShortcutsModal}
      />
    </>
  );
}

export default App;
