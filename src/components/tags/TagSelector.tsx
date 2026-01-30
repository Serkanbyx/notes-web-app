import { useState, useCallback, memo } from 'react';
import {
  useNotesStore,
  selectTags,
  selectAddTag,
  selectDeleteTag,
} from '../../store/useNotesStore';
import { TAG_COLORS } from '../../types';
import TagBadge from './TagBadge';
import Button from '../ui/Button';

interface TagSelectorProps {
  selectedTags: string[];
  onChange: (tags: string[]) => void;
}

/**
 * Tag selector component for selecting multiple tags
 * Memoized to prevent unnecessary re-renders
 * Supports dark mode
 */
const TagSelector = memo(function TagSelector({
  selectedTags,
  onChange,
}: TagSelectorProps) {
  // Use selectors for optimized subscriptions
  const tags = useNotesStore(selectTags);
  const addTag = useNotesStore(selectAddTag);
  const deleteTag = useNotesStore(selectDeleteTag);

  const [isCreating, setIsCreating] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState(TAG_COLORS[0]);

  const handleToggleTag = useCallback(
    (tagId: string) => {
      if (selectedTags.includes(tagId)) {
        onChange(selectedTags.filter((id) => id !== tagId));
      } else {
        onChange([...selectedTags, tagId]);
      }
    },
    [selectedTags, onChange]
  );

  const handleCreateTag = useCallback(() => {
    if (newTagName.trim()) {
      addTag({ name: newTagName.trim(), color: newTagColor });
      setNewTagName('');
      setNewTagColor(TAG_COLORS[0]);
      setIsCreating(false);
    }
  }, [newTagName, newTagColor, addTag]);

  const handleDeleteTag = useCallback(
    (tagId: string) => {
      // TODO: Replace with accessible modal in a11y phase
      if (window.confirm('Bu etiketi silmek istediğinize emin misiniz?')) {
        deleteTag(tagId);
      }
    },
    [deleteTag]
  );

  const handleStartCreating = useCallback(() => {
    setIsCreating(true);
  }, []);

  const handleCancelCreating = useCallback(() => {
    setIsCreating(false);
    setNewTagName('');
  }, []);

  const handleColorSelect = useCallback((color: string) => {
    setNewTagColor(color);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleCreateTag();
      } else if (e.key === 'Escape') {
        handleCancelCreating();
      }
    },
    [handleCreateTag, handleCancelCreating]
  );

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Etiketler
      </label>

      {/* Existing tags */}
      <div
        className="flex flex-wrap gap-2"
        role="group"
        aria-label="Etiket seçimi"
      >
        {tags.map((tag) => (
          <TagBadge
            key={tag.id}
            name={tag.name}
            color={tag.color}
            isSelected={selectedTags.includes(tag.id)}
            onClick={() => handleToggleTag(tag.id)}
            onRemove={() => handleDeleteTag(tag.id)}
          />
        ))}
      </div>

      {/* Create new tag form */}
      {isCreating ? (
        <div className="space-y-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <input
            type="text"
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Etiket adı"
            className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                       focus:outline-none focus:ring-2 focus:ring-primary-500
                       placeholder:text-gray-400 dark:placeholder:text-gray-500"
            maxLength={30}
            autoFocus
            aria-label="Yeni etiket adı"
          />

          {/* Color picker */}
          <div
            className="flex flex-wrap gap-2"
            role="radiogroup"
            aria-label="Etiket rengi seçimi"
          >
            {TAG_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => handleColorSelect(color)}
                className={`
                  w-6 h-6 rounded-full transition-transform
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400
                  dark:focus:ring-offset-gray-800
                  ${newTagColor === color ? 'ring-2 ring-offset-2 ring-gray-400 dark:ring-offset-gray-800 scale-110' : ''}
                `}
                style={{ backgroundColor: color }}
                aria-label={`Renk seç: ${color}`}
                aria-pressed={newTagColor === color}
                role="radio"
                aria-checked={newTagColor === color}
              />
            ))}
          </div>

          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={handleCreateTag}
              disabled={!newTagName.trim()}
            >
              Ekle
            </Button>
            <Button size="sm" variant="secondary" onClick={handleCancelCreating}>
              İptal
            </Button>
          </div>
        </div>
      ) : (
        <button
          onClick={handleStartCreating}
          className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 
                     flex items-center gap-1
                     focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 
                     dark:focus:ring-offset-gray-900 rounded"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Yeni etiket oluştur
        </button>
      )}
    </div>
  );
});

export default TagSelector;
