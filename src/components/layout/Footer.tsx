import { memo, useCallback } from 'react';
import ThemeToggle from '../ui/ThemeToggle';
import {
  useUIStore,
  selectOpenShortcutsModal,
} from '../../store/useUIStore';
import { getModifierKey } from '../../hooks/useKeyboardShortcuts';

/**
 * Footer component with creator signature, theme toggle, and shortcuts button
 * Supports dark mode
 */
const Footer = memo(function Footer() {
  const openShortcutsModal = useUIStore(selectOpenShortcutsModal);

  const handleOpenShortcuts = useCallback(() => {
    openShortcutsModal();
  }, [openShortcutsModal]);

  return (
    <footer className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Created by{' '}
          <a
            href="https://serkanbayraktar.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 hover:underline transition-colors"
          >
            Serkanby
          </a>
          {' | '}
          <a
            href="https://github.com/Serkanbyx"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 hover:underline transition-colors"
          >
            Github
          </a>
        </p>
        <div className="flex items-center gap-1">
          {/* Keyboard shortcuts button */}
          <button
            onClick={handleOpenShortcuts}
            className="p-2 rounded-lg text-gray-600 dark:text-gray-300 
                       hover:bg-gray-100 dark:hover:bg-gray-700
                       focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                       dark:focus:ring-offset-gray-800
                       transition-colors group"
            aria-label="Klavye kısayollarını göster"
            title={`Klavye kısayolları (${getModifierKey()}+/)`}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
              />
            </svg>
          </button>
          <ThemeToggle />
        </div>
      </div>
    </footer>
  );
});

export default Footer;
