import { useNavigate } from 'react-router-dom';
import type { Note } from '../../types';
import { useNotesStore } from '../../store/useNotesStore';
import TagBadge from '../tags/TagBadge';

interface NoteCardProps {
  note: Note;
  isSelected?: boolean;
}

/**
 * Note card component for displaying note preview in list
 */
function NoteCard({ note, isSelected = false }: NoteCardProps) {
  const navigate = useNavigate();
  const { tags } = useNotesStore();

  // Get tag objects for this note
  const noteTags = tags.filter((tag) => note.tags.includes(tag.id));

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  // Get content preview (first 100 characters)
  const contentPreview = note.content
    .replace(/[#*`_~\[\]]/g, '') // Remove markdown syntax
    .slice(0, 100)
    .trim();

  const handleClick = () => {
    navigate(`/note/${note.id}`);
  };

  return (
    <article
      onClick={handleClick}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
      className={`
        p-4 rounded-lg cursor-pointer transition-all duration-200
        border-l-4
        ${isSelected
          ? 'bg-primary-50 border-l-primary-500 shadow-sm'
          : 'bg-white hover:bg-gray-50 border-l-transparent hover:border-l-gray-300'
        }
      `}
      role="button"
      tabIndex={0}
      aria-label={`Not: ${note.title}`}
    >
      {/* Title */}
      <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
        {note.title}
      </h3>

      {/* Content preview */}
      {contentPreview && (
        <p className="text-sm text-gray-500 mb-2 line-clamp-2">
          {contentPreview}
          {note.content.length > 100 && '...'}
        </p>
      )}

      {/* Footer: Tags and date */}
      <div className="flex items-center justify-between gap-2">
        {/* Tags */}
        <div className="flex flex-wrap gap-1 flex-1 min-w-0">
          {noteTags.slice(0, 3).map((tag) => (
            <TagBadge
              key={tag.id}
              name={tag.name}
              color={tag.color}
              size="sm"
            />
          ))}
          {noteTags.length > 3 && (
            <span className="text-xs text-gray-400">
              +{noteTags.length - 3}
            </span>
          )}
        </div>

        {/* Date */}
        <time
          dateTime={note.updatedAt}
          className="text-xs text-gray-400 whitespace-nowrap"
        >
          {formatDate(note.updatedAt)}
        </time>
      </div>
    </article>
  );
}

export default NoteCard;
