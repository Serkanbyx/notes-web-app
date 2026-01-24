import { useState } from 'react';
import { useNotesStore } from '../../store/useNotesStore';
import { TAG_COLORS } from '../../types';
import TagBadge from './TagBadge';
import Button from '../ui/Button';

interface TagSelectorProps {
  selectedTags: string[];
  onChange: (tags: string[]) => void;
}

/**
 * Tag selector component for selecting multiple tags
 */
function TagSelector({ selectedTags, onChange }: TagSelectorProps) {
  const { tags, addTag, deleteTag } = useNotesStore();
  const [isCreating, setIsCreating] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState(TAG_COLORS[0]);

  const handleToggleTag = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      onChange(selectedTags.filter((id) => id !== tagId));
    } else {
      onChange([...selectedTags, tagId]);
    }
  };

  const handleCreateTag = () => {
    if (newTagName.trim()) {
      addTag({ name: newTagName.trim(), color: newTagColor });
      setNewTagName('');
      setNewTagColor(TAG_COLORS[0]);
      setIsCreating(false);
    }
  };

  const handleDeleteTag = (tagId: string) => {
    if (window.confirm('Bu etiketi silmek istediğinize emin misiniz?')) {
      deleteTag(tagId);
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        Etiketler
      </label>

      {/* Existing tags */}
      <div className="flex flex-wrap gap-2">
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
        <div className="space-y-3 p-3 bg-gray-50 rounded-lg">
          <input
            type="text"
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            placeholder="Etiket adı"
            className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md
                       focus:outline-none focus:ring-2 focus:ring-primary-500"
            maxLength={30}
            autoFocus
          />
          
          {/* Color picker */}
          <div className="flex flex-wrap gap-2">
            {TAG_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setNewTagColor(color)}
                className={`
                  w-6 h-6 rounded-full transition-transform
                  ${newTagColor === color ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' : ''}
                `}
                style={{ backgroundColor: color }}
                aria-label={`Renk: ${color}`}
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
            <Button
              size="sm"
              variant="secondary"
              onClick={() => {
                setIsCreating(false);
                setNewTagName('');
              }}
            >
              İptal
            </Button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsCreating(true)}
          className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
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
}

export default TagSelector;
