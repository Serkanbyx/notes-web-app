import { useState, useCallback, useMemo, useEffect, useRef, memo } from 'react';
import ReactMarkdown from 'react-markdown';

interface NoteEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

type EditorMode = 'write' | 'preview' | 'split';

/**
 * Debounce delay for markdown preview rendering (ms)
 */
const PREVIEW_DEBOUNCE_DELAY = 200;

/**
 * Debounced Markdown Preview component
 * Prevents re-rendering on every keystroke
 */
const DebouncedMarkdownPreview = memo(function DebouncedMarkdownPreview({
  content,
  delay = PREVIEW_DEBOUNCE_DELAY,
}: {
  content: string;
  delay?: number;
}) {
  const [debouncedContent, setDebouncedContent] = useState(content);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new debounced value
    timeoutRef.current = setTimeout(() => {
      setDebouncedContent(content);
    }, delay);

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [content, delay]);

  if (!debouncedContent) {
    return (
      <p className="text-gray-400 dark:text-gray-500 italic">
        Önizleme için bir şeyler yazın...
      </p>
    );
  }

  return (
    <div className="prose-notes">
      <ReactMarkdown>{debouncedContent}</ReactMarkdown>
    </div>
  );
});

/**
 * Mode button component
 */
interface ModeButtonProps {
  mode: EditorMode;
  currentMode: EditorMode;
  onClick: (mode: EditorMode) => void;
  icon: React.ReactNode;
  label: string;
}

const ModeButton = memo(function ModeButton({
  mode,
  currentMode,
  onClick,
  icon,
  label,
}: ModeButtonProps) {
  const isActive = mode === currentMode;

  const handleClick = useCallback(() => {
    onClick(mode);
  }, [onClick, mode]);

  return (
    <button
      onClick={handleClick}
      className={`
        px-3 py-1.5 text-sm font-medium rounded-md transition-colors
        focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1
        dark:focus:ring-offset-gray-800
        ${
          isActive
            ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
            : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
        }
      `}
      aria-pressed={isActive}
      role="tab"
      aria-selected={isActive}
    >
      <span className="flex items-center gap-1.5">
        {icon}
        {label}
      </span>
    </button>
  );
});

/**
 * Markdown editor with preview functionality
 * Optimized with memoization and debounced preview
 * Supports dark mode
 */
const NoteEditor = memo(function NoteEditor({
  content,
  onChange,
  placeholder = 'Markdown ile yazmaya başlayın...',
}: NoteEditorProps) {
  const [mode, setMode] = useState<EditorMode>('write');

  // Memoize mode change handler
  const handleModeChange = useCallback((newMode: EditorMode) => {
    setMode(newMode);
  }, []);

  // Memoize content change handler
  const handleContentChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange(e.target.value);
    },
    [onChange]
  );

  // Memoize icons to prevent re-creation
  const writeIcon = useMemo(
    () => (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
        />
      </svg>
    ),
    []
  );

  const previewIcon = useMemo(
    () => (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
        />
      </svg>
    ),
    []
  );

  const splitIcon = useMemo(
    () => (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
        />
      </svg>
    ),
    []
  );

  // Memoize textarea class
  const textareaClass = useMemo(
    () => `
      w-full h-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg resize-none
      focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
      placeholder:text-gray-400 dark:placeholder:text-gray-500 
      font-mono text-sm leading-relaxed
      bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
      ${mode === 'split' ? 'min-h-[300px]' : 'min-h-[400px]'}
    `,
    [mode]
  );

  // Memoize preview container class
  const previewClass = useMemo(
    () => `
      w-full h-full p-4 border border-gray-200 dark:border-gray-700 rounded-lg overflow-auto 
      bg-white dark:bg-gray-800
      ${mode === 'split' ? 'min-h-[300px]' : 'min-h-[400px]'}
    `,
    [mode]
  );

  return (
    <div className="flex flex-col h-full">
      {/* Mode toggle buttons */}
      <div
        className="flex items-center gap-1 mb-3 border-b border-gray-200 dark:border-gray-700 pb-3"
        role="tablist"
        aria-label="Editör modu seçimi"
      >
        <ModeButton
          mode="write"
          currentMode={mode}
          onClick={handleModeChange}
          icon={writeIcon}
          label="Yaz"
        />
        <ModeButton
          mode="preview"
          currentMode={mode}
          onClick={handleModeChange}
          icon={previewIcon}
          label="Önizle"
        />
        <ModeButton
          mode="split"
          currentMode={mode}
          onClick={handleModeChange}
          icon={splitIcon}
          label="Bölünmüş"
        />

        {/* Markdown hint */}
        <span className="ml-auto text-xs text-gray-400 dark:text-gray-500">
          Markdown desteklenir
        </span>
      </div>

      {/* Editor content */}
      <div
        className={`flex-1 min-h-0 ${mode === 'split' ? 'grid grid-cols-2 gap-4' : ''}`}
        role="tabpanel"
      >
        {/* Textarea - Write mode or Split mode */}
        {(mode === 'write' || mode === 'split') && (
          <textarea
            value={content}
            onChange={handleContentChange}
            placeholder={placeholder}
            className={textareaClass}
            aria-label="Not içeriği"
          />
        )}

        {/* Preview - Preview mode or Split mode */}
        {(mode === 'preview' || mode === 'split') && (
          <div className={previewClass}>
            <DebouncedMarkdownPreview content={content} />
          </div>
        )}
      </div>
    </div>
  );
});

export default NoteEditor;
