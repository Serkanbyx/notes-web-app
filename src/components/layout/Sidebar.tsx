import { useNavigate, useParams } from 'react-router-dom';
import { useNotesStore } from '../../store/useNotesStore';
import SearchBar from '../ui/SearchBar';
import Button from '../ui/Button';
import NoteCard from '../notes/NoteCard';
import TagBadge from '../tags/TagBadge';

/**
 * Sidebar component with search, tags filter, and notes list
 */
function Sidebar() {
  const navigate = useNavigate();
  const { id: currentNoteId } = useParams<{ id: string }>();
  
  const {
    tags,
    searchQuery,
    setSearchQuery,
    selectedTags,
    toggleTagFilter,
    getFilteredNotes,
  } = useNotesStore();

  const filteredNotes = getFilteredNotes();

  const handleNewNote = () => {
    navigate('/note/new');
  };

  return (
    <aside className="flex flex-col h-full bg-gray-50 border-r border-gray-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Notlarım
        </h1>

        {/* Search */}
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Notlarda ara..."
        />
      </div>

      {/* Tag filters */}
      {tags.length > 0 && (
        <div className="px-4 py-3 border-b border-gray-200">
          <p className="text-xs font-medium text-gray-500 mb-2">
            Etiketlere göre filtrele
          </p>
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <TagBadge
                key={tag.id}
                name={tag.name}
                color={tag.color}
                size="sm"
                isSelected={selectedTags.includes(tag.id)}
                onClick={() => toggleTagFilter(tag.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Notes list */}
      <div className="flex-1 overflow-y-auto p-2">
        {filteredNotes.length > 0 ? (
          <div className="space-y-2">
            {filteredNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                isSelected={note.id === currentNoteId}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <svg
              className="w-12 h-12 text-gray-300 mb-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
              />
            </svg>
            <p className="text-gray-500 text-sm">
              {searchQuery || selectedTags.length > 0
                ? 'Eşleşen not bulunamadı'
                : 'Henüz not yok'}
            </p>
            {!searchQuery && selectedTags.length === 0 && (
              <p className="text-gray-400 text-xs mt-1">
                Yeni bir not oluşturmak için aşağıdaki butona tıklayın
              </p>
            )}
          </div>
        )}
      </div>

      {/* New note button */}
      <div className="p-4 border-t border-gray-200">
        <Button onClick={handleNewNote} className="w-full">
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Yeni Not
        </Button>
      </div>
    </aside>
  );
}

export default Sidebar;
