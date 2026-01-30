import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Theme options
 */
export type Theme = 'light' | 'dark' | 'system';

/**
 * Theme store state interface
 */
interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

/**
 * Storage key for theme persistence
 */
const THEME_STORAGE_KEY = 'notes-app-theme';

/**
 * Apply theme to document
 */
const applyTheme = (theme: Theme): void => {
  const root = document.documentElement;
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  // Remove both classes first
  root.classList.remove('light', 'dark');

  // Apply the appropriate theme
  if (theme === 'dark' || (theme === 'system' && systemPrefersDark)) {
    root.classList.add('dark');
  } else {
    root.classList.add('light');
  }
};

/**
 * Get initial theme from localStorage or default to system
 */
const getInitialTheme = (): Theme => {
  if (typeof window === 'undefined') return 'system';

  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.state?.theme) {
        return parsed.state.theme as Theme;
      }
    }
  } catch {
    // Ignore errors, return default
  }
  return 'system';
};

// Apply initial theme immediately to prevent flash
if (typeof window !== 'undefined') {
  applyTheme(getInitialTheme());
}

/**
 * Theme store with persistence
 */
export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'system',

      setTheme: (theme: Theme) => {
        applyTheme(theme);
        set({ theme });
      },
    }),
    {
      name: THEME_STORAGE_KEY,
      onRehydrateStorage: () => (state) => {
        // Apply theme after rehydration
        if (state) {
          applyTheme(state.theme);
        }
      },
    }
  )
);

/**
 * Listen for system theme changes
 */
if (typeof window !== 'undefined') {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

  const handleSystemThemeChange = () => {
    const { theme } = useThemeStore.getState();
    if (theme === 'system') {
      applyTheme('system');
    }
  };

  // Use addEventListener for better browser support
  mediaQuery.addEventListener('change', handleSystemThemeChange);
}

// Selectors
export const selectTheme = (state: ThemeState) => state.theme;
export const selectSetTheme = (state: ThemeState) => state.setTheme;
