import { Routes, Route, Navigate } from 'react-router-dom';
import SplitLayout from './components/layout/SplitLayout';
import NotesListPage from './pages/NotesListPage';
import NoteDetailPage from './pages/NoteDetailPage';

/**
 * Main application component
 * Handles routing and layout structure
 */
function App() {
  return (
    <SplitLayout>
      <Routes>
        <Route path="/" element={<NotesListPage />} />
        <Route path="/note/new" element={<NoteDetailPage />} />
        <Route path="/note/:id" element={<NoteDetailPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </SplitLayout>
  );
}

export default App;
