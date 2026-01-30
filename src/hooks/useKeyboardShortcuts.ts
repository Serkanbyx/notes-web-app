import { useEffect, useCallback, useRef } from 'react';

/**
 * Keyboard shortcut definition
 */
export interface KeyboardShortcut {
  /** Unique key for the shortcut */
  key: string;
  /** Human-readable description */
  description: string;
  /** The key to listen for (e.g., 'n', 's', 'f') */
  shortcutKey: string;
  /** Whether Ctrl (Windows/Linux) or Cmd (Mac) is required */
  ctrlOrCmd?: boolean;
  /** Whether Shift is required */
  shift?: boolean;
  /** Whether Alt/Option is required */
  alt?: boolean;
  /** The action to perform */
  action: () => void;
  /** Whether to prevent default browser behavior */
  preventDefault?: boolean;
}

/**
 * Check if the current OS is Mac
 */
const isMac = typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform);

/**
 * Get the modifier key name based on OS
 */
export const getModifierKey = (): string => (isMac ? '⌘' : 'Ctrl');

/**
 * Format a shortcut for display
 */
export const formatShortcut = (shortcut: KeyboardShortcut): string => {
  const parts: string[] = [];

  if (shortcut.ctrlOrCmd) {
    parts.push(getModifierKey());
  }
  if (shortcut.alt) {
    parts.push(isMac ? '⌥' : 'Alt');
  }
  if (shortcut.shift) {
    parts.push(isMac ? '⇧' : 'Shift');
  }

  // Format the key
  let key = shortcut.shortcutKey.toUpperCase();
  if (key === ' ') key = 'Space';
  if (key === 'ESCAPE') key = 'Esc';
  if (key === '/') key = '/';

  parts.push(key);

  return parts.join(isMac ? '' : ' + ');
};

/**
 * Default keyboard shortcuts for the app
 */
export const DEFAULT_SHORTCUTS: Omit<KeyboardShortcut, 'action'>[] = [
  {
    key: 'new-note',
    description: 'Yeni not oluştur',
    shortcutKey: 'n',
    ctrlOrCmd: true,
    preventDefault: true,
  },
  {
    key: 'save',
    description: 'Notu kaydet',
    shortcutKey: 's',
    ctrlOrCmd: true,
    preventDefault: true,
  },
  {
    key: 'search',
    description: 'Arama alanına odaklan',
    shortcutKey: 'f',
    ctrlOrCmd: true,
    preventDefault: true,
  },
  {
    key: 'delete',
    description: 'Notu sil',
    shortcutKey: 'd',
    ctrlOrCmd: true,
    shift: true,
    preventDefault: true,
  },
  {
    key: 'shortcuts',
    description: 'Kısayolları göster',
    shortcutKey: '/',
    ctrlOrCmd: true,
    preventDefault: true,
  },
  {
    key: 'mode-write',
    description: 'Yazma moduna geç',
    shortcutKey: '1',
    ctrlOrCmd: true,
    preventDefault: true,
  },
  {
    key: 'mode-preview',
    description: 'Önizleme moduna geç',
    shortcutKey: '2',
    ctrlOrCmd: true,
    preventDefault: true,
  },
  {
    key: 'mode-split',
    description: 'Bölünmüş moda geç',
    shortcutKey: '3',
    ctrlOrCmd: true,
    preventDefault: true,
  },
];

/**
 * Hook options
 */
interface UseKeyboardShortcutsOptions {
  /** Whether shortcuts are enabled */
  enabled?: boolean;
}

/**
 * Hook to handle global keyboard shortcuts
 * 
 * @param shortcuts - Array of keyboard shortcuts to listen for
 * @param options - Hook options
 */
export function useKeyboardShortcuts(
  shortcuts: KeyboardShortcut[],
  options: UseKeyboardShortcutsOptions = {}
): void {
  const { enabled = true } = options;
  const shortcutsRef = useRef(shortcuts);

  // Update ref when shortcuts change
  useEffect(() => {
    shortcutsRef.current = shortcuts;
  }, [shortcuts]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in input fields
      const target = event.target as HTMLElement;
      const isInputField =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable;

      // Allow some shortcuts even in input fields
      const allowInInput = ['save', 'shortcuts'];

      for (const shortcut of shortcutsRef.current) {
        // Check if we should skip this shortcut in input fields
        if (isInputField && !allowInInput.includes(shortcut.key)) {
          continue;
        }

        // Check modifier keys
        const ctrlOrCmdPressed = isMac ? event.metaKey : event.ctrlKey;
        const shiftPressed = event.shiftKey;
        const altPressed = event.altKey;

        // Check if all required modifiers match
        const modifiersMatch =
          (shortcut.ctrlOrCmd ?? false) === ctrlOrCmdPressed &&
          (shortcut.shift ?? false) === shiftPressed &&
          (shortcut.alt ?? false) === altPressed;

        // Check if the key matches
        const keyMatches =
          event.key.toLowerCase() === shortcut.shortcutKey.toLowerCase();

        if (modifiersMatch && keyMatches) {
          if (shortcut.preventDefault !== false) {
            event.preventDefault();
          }
          shortcut.action();
          return;
        }
      }
    },
    []
  );

  useEffect(() => {
    if (!enabled) return;

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [enabled, handleKeyDown]);
}

/**
 * Hook to create keyboard shortcuts with actions
 */
export function useAppKeyboardShortcuts(actions: {
  onNewNote?: () => void;
  onSave?: () => void;
  onSearch?: () => void;
  onDelete?: () => void;
  onShowShortcuts?: () => void;
  onModeWrite?: () => void;
  onModePreview?: () => void;
  onModeSplit?: () => void;
}): KeyboardShortcut[] {
  return DEFAULT_SHORTCUTS.map((shortcut) => {
    let action: () => void = () => {};

    switch (shortcut.key) {
      case 'new-note':
        action = actions.onNewNote ?? (() => {});
        break;
      case 'save':
        action = actions.onSave ?? (() => {});
        break;
      case 'search':
        action = actions.onSearch ?? (() => {});
        break;
      case 'delete':
        action = actions.onDelete ?? (() => {});
        break;
      case 'shortcuts':
        action = actions.onShowShortcuts ?? (() => {});
        break;
      case 'mode-write':
        action = actions.onModeWrite ?? (() => {});
        break;
      case 'mode-preview':
        action = actions.onModePreview ?? (() => {});
        break;
      case 'mode-split':
        action = actions.onModeSplit ?? (() => {});
        break;
    }

    return { ...shortcut, action };
  }).filter((s) => s.action !== undefined) as KeyboardShortcut[];
}
