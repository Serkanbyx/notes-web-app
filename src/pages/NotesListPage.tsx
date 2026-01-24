import { useNavigate } from 'react-router-dom';
import { useNotesStore } from '../store/useNotesStore';
import Button from '../components/ui/Button';

/**
 * Notes list page - displayed in main content when no note is selected
 */
function NotesListPage() {
  const navigate = useNavigate();
  const { notes, getFilteredNotes } = useNotesStore();
  const filteredNotes = getFilteredNotes();

  const handleNewNote = () => {
    navigate('/note/new');
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
      <div className="max-w-md">
        {/* Icon */}
        <div className="mb-6">
          <svg
            className="w-24 h-24 mx-auto text-gray-200"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>

        {/* Title and description */}
        {notes.length === 0 ? (
          <>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Notes App'e Hoş Geldiniz
            </h2>
            <p className="text-gray-500 mb-6">
              Markdown destekli not alma uygulaması ile fikirlerinizi düzenleyin.
              İlk notunuzu oluşturarak başlayın!
            </p>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Bir not seçin
            </h2>
            <p className="text-gray-500 mb-6">
              Sol panelden bir not seçin veya yeni bir not oluşturun.
              <br />
              <span className="text-sm">
                {filteredNotes.length} / {notes.length} not gösteriliyor
              </span>
            </p>
          </>
        )}

        {/* Action button */}
        <Button onClick={handleNewNote} size="lg">
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
          Yeni Not Oluştur
        </Button>

        {/* Features list */}
        <div className="mt-12 text-left">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">
            Özellikler
          </h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-3 text-sm text-gray-600">
              <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Markdown desteği ile zengin içerik oluşturun</span>
            </li>
            <li className="flex items-start gap-3 text-sm text-gray-600">
              <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Etiketler ile notlarınızı kategorize edin</span>
            </li>
            <li className="flex items-start gap-3 text-sm text-gray-600">
              <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Otomatik kaydetme - hiçbir şey kaybolmaz</span>
            </li>
            <li className="flex items-start gap-3 text-sm text-gray-600">
              <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Çevrimdışı çalışır - internet gerekmez</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default NotesListPage;
