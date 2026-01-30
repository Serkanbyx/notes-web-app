import { memo } from 'react';

/**
 * Page loading spinner component
 * Used as Suspense fallback for lazy-loaded pages
 * Supports dark mode
 */
const PageLoader = memo(function PageLoader() {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 bg-white dark:bg-gray-900">
      <div className="relative">
        {/* Spinner */}
        <div className="w-12 h-12 border-4 border-gray-200 dark:border-gray-700 border-t-primary-500 rounded-full animate-spin" />
      </div>
      <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
        Yükleniyor...
      </p>
    </div>
  );
});

export default PageLoader;
