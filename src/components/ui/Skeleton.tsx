import { memo } from 'react';

interface SkeletonProps {
  className?: string;
  /** Width of the skeleton */
  width?: string | number;
  /** Height of the skeleton */
  height?: string | number;
  /** Whether to use rounded corners */
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
}

/**
 * Base skeleton component with shimmer animation
 * Supports dark mode
 */
const Skeleton = memo(function Skeleton({
  className = '',
  width,
  height,
  rounded = 'md',
}: SkeletonProps) {
  const roundedClasses = {
    none: '',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full',
  };

  return (
    <div
      className={`animate-pulse bg-gray-200 dark:bg-gray-700 ${roundedClasses[rounded]} ${className}`}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
      }}
      aria-hidden="true"
    />
  );
});

/**
 * Skeleton for note cards in the sidebar
 */
export const NoteCardSkeleton = memo(function NoteCardSkeleton() {
  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border-l-4 border-l-transparent">
      {/* Title */}
      <Skeleton height={20} width="70%" className="mb-2" />
      {/* Content preview line 1 */}
      <Skeleton height={14} width="100%" className="mb-1" />
      {/* Content preview line 2 */}
      <Skeleton height={14} width="60%" className="mb-3" />
      {/* Footer: Tags and date */}
      <div className="flex items-center justify-between">
        <div className="flex gap-1">
          <Skeleton height={20} width={50} rounded="full" />
          <Skeleton height={20} width={40} rounded="full" />
        </div>
        <Skeleton height={12} width={60} />
      </div>
    </div>
  );
});

/**
 * Skeleton for the sidebar notes list
 */
export const SidebarSkeleton = memo(function SidebarSkeleton() {
  return (
    <div className="space-y-2 p-2">
      {[...Array(5)].map((_, i) => (
        <NoteCardSkeleton key={i} />
      ))}
    </div>
  );
});

/**
 * Skeleton for the note editor
 */
export const EditorSkeleton = memo(function EditorSkeleton() {
  return (
    <div className="flex flex-col h-full p-6">
      {/* Title input */}
      <Skeleton height={48} width="100%" className="mb-4" />
      {/* Tags */}
      <div className="flex gap-2 mb-4">
        <Skeleton height={28} width={80} rounded="full" />
        <Skeleton height={28} width={60} rounded="full" />
        <Skeleton height={28} width={100} rounded="full" />
      </div>
      {/* Editor mode buttons */}
      <div className="flex gap-2 mb-4">
        <Skeleton height={36} width={80} rounded="md" />
        <Skeleton height={36} width={80} rounded="md" />
        <Skeleton height={36} width={80} rounded="md" />
      </div>
      {/* Editor content */}
      <div className="flex-1">
        <Skeleton height="100%" width="100%" className="min-h-[300px]" />
      </div>
    </div>
  );
});

/**
 * Skeleton for the page header
 */
export const HeaderSkeleton = memo(function HeaderSkeleton() {
  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-4">
        <Skeleton height={24} width={24} rounded="md" />
        <Skeleton height={16} width={120} />
      </div>
      <Skeleton height={32} width={60} rounded="md" />
    </div>
  );
});

export default Skeleton;
