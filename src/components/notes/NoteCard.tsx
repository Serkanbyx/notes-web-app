import { useMemo, useCallback, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Note } from '../../types';
import { useNotesStore, selectTagsById } from '../../store/useNotesStore';
import TagBadge from '../tags/TagBadge';

interface NoteCardProps {
  note: Note;
  isSelected?: boolean;
}

/**
 * Format date for display (memoized outside component)
 */
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

/**
 * Note card component for displaying note preview in list
 * Memoized to prevent unnecessary re-renders
 * Supports dark mode
 */
const NoteCard = memo(function NoteCard({
  note,
  isSelected = false,
}: NoteCardProps) {
  const navigate = useNavigate();

  // Use tagsById lookup for O(1) access instead of filtering entire tags array
  const tagsById = useNotesStore(selectTagsById);

  // Memoize tag objects for this note
  const noteTags = useMemo(() => {
    return note.tags.map((tagId) => tagsById[tagId]).filter(Boolean);
  }, [note.tags, tagsById]);

  // Memoize content preview
  const contentPreview = useMemo(() => {
    return note.content
      .replace(/[#*`_~\[\]]/g, '') // Remove markdown syntax
      .slice(0, 100)
      .trim();
  }, [note.content]);

  // Memoize formatted date
  const formattedDate = useMemo(
    () => formatDate(note.updatedAt),
    [note.updatedAt]
  );

  // Memoize click handler
  const handleClick = useCallback(() => {
    navigate(`/note/${note.id}`);
  }, [navigate, note.id]);

  // Memoize keyboard handler
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleClick();
      }
    },
    [handleClick]
  );

  return (
    <article
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={`
        p-4 rounded-lg cursor-pointer transition-all duration-200
        border-l-4
        ${
          isSelected
            ? 'bg-primary-50 dark:bg-primary-900/20 border-l-primary-500 shadow-sm'
            : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border-l-transparent hover:border-l-gray-300 dark:hover:border-l-gray-500'
        }
      `}
      role="button"
      tabIndex={0}
      aria-label={`Not: ${note.title}`}
      aria-selected={isSelected}
    >
      {/* Title */}
      <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1 line-clamp-1">
        {note.title}
      </h3>

      {/* Content preview */}
      {contentPreview && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 line-clamp-2">
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
            <span className="text-xs text-gray-400 dark:text-gray-500">
              +{noteTags.length - 3}
            </span>
          )}
        </div>

        {/* Date */}
        <time
          dateTime={note.updatedAt}
          className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap"
        >
          {formattedDate}
        </time>
      </div>
    </article>
  );
});

export default NoteCard;
