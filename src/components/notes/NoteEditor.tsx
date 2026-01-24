import { useState } from 'react';
import ReactMarkdown from 'react-markdown';

interface NoteEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

type EditorMode = 'write' | 'preview' | 'split';

/**
 * Markdown editor with preview functionality
 */
function NoteEditor({
  content,
  onChange,
  placeholder = 'Markdown ile yazmaya başlayın...',
}: NoteEditorProps) {
  const [mode, setMode] = useState<EditorMode>('write');

  return (
    <div className="flex flex-col h-full">
      {/* Mode toggle buttons */}
      <div className="flex items-center gap-1 mb-3 border-b border-gray-200 pb-3">
        <button
          onClick={() => setMode('write')}
          className={`
            px-3 py-1.5 text-sm font-medium rounded-md transition-colors
            ${mode === 'write'
              ? 'bg-primary-100 text-primary-700'
              : 'text-gray-600 hover:bg-gray-100'
            }
          `}
          aria-pressed={mode === 'write'}
        >
          <span className="flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Yaz
          </span>
        </button>
        <button
          onClick={() => setMode('preview')}
          className={`
            px-3 py-1.5 text-sm font-medium rounded-md transition-colors
            ${mode === 'preview'
              ? 'bg-primary-100 text-primary-700'
              : 'text-gray-600 hover:bg-gray-100'
            }
          `}
          aria-pressed={mode === 'preview'}
        >
          <span className="flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Önizle
          </span>
        </button>
        <button
          onClick={() => setMode('split')}
          className={`
            px-3 py-1.5 text-sm font-medium rounded-md transition-colors
            ${mode === 'split'
              ? 'bg-primary-100 text-primary-700'
              : 'text-gray-600 hover:bg-gray-100'
            }
          `}
          aria-pressed={mode === 'split'}
        >
          <span className="flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
            </svg>
            Bölünmüş
          </span>
        </button>

        {/* Markdown hint */}
        <span className="ml-auto text-xs text-gray-400">
          Markdown desteklenir
        </span>
      </div>

      {/* Editor content */}
      <div className={`flex-1 min-h-0 ${mode === 'split' ? 'grid grid-cols-2 gap-4' : ''}`}>
        {/* Textarea - Write mode or Split mode */}
        {(mode === 'write' || mode === 'split') && (
          <textarea
            value={content}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={`
              w-full h-full p-4 border border-gray-300 rounded-lg resize-none
              focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
              placeholder:text-gray-400 font-mono text-sm leading-relaxed
              ${mode === 'split' ? 'min-h-[300px]' : 'min-h-[400px]'}
            `}
            aria-label="Not içeriği"
          />
        )}

        {/* Preview - Preview mode or Split mode */}
        {(mode === 'preview' || mode === 'split') && (
          <div
            className={`
              w-full h-full p-4 border border-gray-200 rounded-lg overflow-auto bg-white
              ${mode === 'split' ? 'min-h-[300px]' : 'min-h-[400px]'}
            `}
          >
            {content ? (
              <div className="prose-notes">
                <ReactMarkdown>{content}</ReactMarkdown>
              </div>
            ) : (
              <p className="text-gray-400 italic">Önizleme için bir şeyler yazın...</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default NoteEditor;
