import { memo, useCallback } from 'react';

interface TagBadgeProps {
  name: string;
  color: string;
  onRemove?: () => void;
  onClick?: () => void;
  isSelected?: boolean;
  size?: 'sm' | 'md';
}

/**
 * Tag badge component for displaying tags
 * Memoized for performance, supports dark mode
 */
const TagBadge = memo(function TagBadge({
  name,
  color,
  onRemove,
  onClick,
  isSelected = false,
  size = 'md',
}: TagBadgeProps) {
  const sizeClasses =
    size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-2.5 py-1';

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (onClick && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        onClick();
      }
    },
    [onClick]
  );

  const handleRemoveClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onRemove?.();
    },
    [onRemove]
  );

  return (
    <span
      className={`
        inline-flex items-center gap-1 rounded-full font-medium
        transition-all duration-200
        ${sizeClasses}
        ${onClick ? 'cursor-pointer hover:opacity-80' : ''}
        ${isSelected ? 'ring-2 ring-offset-1 dark:ring-offset-gray-800' : ''}
      `}
      style={{
        backgroundColor: `${color}20`,
        color: color,
        borderColor: color,
        ...(isSelected && { ringColor: color }),
      }}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={handleKeyDown}
      aria-pressed={onClick ? isSelected : undefined}
    >
      {name}
      {onRemove && (
        <button
          onClick={handleRemoveClick}
          className="ml-0.5 hover:opacity-70 focus:outline-none focus:ring-1 focus:ring-current rounded-full"
          aria-label={`${name} etiketini kaldır`}
        >
          <svg
            className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'}
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}
    </span>
  );
});

export default TagBadge;
