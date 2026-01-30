# 📝 Notes Web App

A modern, responsive note-taking application with Markdown support, tagging system, dark mode, keyboard shortcuts, and auto-save functionality. Organize your notes efficiently with a beautiful split-layout interface.

[![Created by Serkanby](https://img.shields.io/badge/Created%20by-Serkanby-blue?style=flat-square)](https://serkanbayraktar.com/)
[![GitHub](https://img.shields.io/badge/GitHub-Serkanbyx-181717?style=flat-square&logo=github)](https://github.com/Serkanbyx)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

## Features

- **CRUD Operations**: Create, read, update, and delete notes seamlessly
- **Markdown Support**: Rich text formatting with live Markdown preview
- **Tagging System**: Categorize and organize your notes with custom colored tags
- **Smart Search**: Quick search across titles and content
- **Auto-Save**: Automatic saving with 1-second debounce delay and status indicator
- **Offline Support**: Local-first approach using localStorage with persistence
- **Responsive Design**: Mobile and desktop friendly split layout
- **Multiple View Modes**: Write, Preview, and Split view for Markdown editing
- **Dark Mode**: System preference detection with manual toggle (Light/Dark/System)
- **Keyboard Shortcuts**: Productivity-boosting shortcuts with visual guide modal
- **Error Handling**: Graceful error boundaries with fallback UI
- **Toast Notifications**: Visual feedback for user actions
- **Accessible Modals**: WCAG-compliant dialogs with focus trap
- **Code Splitting**: Lazy-loaded pages for optimal performance

## Live Demo

[🚀 View Live Demo](https://notes-web-apppp.netlify.app/)

## Screenshots

### Main Screen

The sidebar displays all your notes with search functionality and tag filters.

### Note Editor

Full-featured Markdown editor with real-time preview and tag management.

### Split View

Side-by-side editing and preview for the best writing experience.

### Dark Mode

Beautiful dark theme with system preference detection.

## Technologies

- **React 18**: Modern UI library with hooks and functional components
- **TypeScript**: Type-safe development with enhanced IDE support
- **Vite**: Lightning-fast build tool and development server
- **Zustand**: Lightweight state management with persist and devtools middleware
- **React Hook Form**: Performant form handling with minimal re-renders
- **Zod**: TypeScript-first schema validation
- **React Router v6**: Declarative routing for single-page applications
- **Tailwind CSS**: Utility-first CSS framework with dark mode support
- **react-markdown**: Safe Markdown to React component rendering

## Installation

### Prerequisites

Make sure you have the following installed:

- Node.js (v18 or higher)
- npm or yarn

### Local Development

```bash
# Clone the repository
git clone https://github.com/Serkanbyx/notes-web-app.git

# Navigate to project directory
cd notes-web-app

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

## Usage

1. **Create a New Note**: Click the "Yeni Not" button or press `Ctrl+N` (⌘+N on Mac)
2. **Enter Title**: Provide a descriptive title for your note (required)
3. **Add Tags**: Select existing tags or create new ones to categorize your note
4. **Write Content**: Use Markdown syntax for rich text formatting
5. **Auto-Save**: Your note is automatically saved as you type

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+N` / `⌘+N` | Create new note |
| `Ctrl+F` / `⌘+F` | Focus search |
| `Ctrl+S` / `⌘+S` | Save note |
| `Ctrl+/` / `⌘+/` | Show shortcuts modal |
| `Ctrl+1` / `⌘+1` | Write mode |
| `Ctrl+2` / `⌘+2` | Preview mode |
| `Ctrl+3` / `⌘+3` | Split mode |

Press `Ctrl+/` or click the keyboard icon in the footer to view all shortcuts.

### Markdown Editor Modes

| Mode | Description |
|------|-------------|
| **Write** | Plain text editing mode |
| **Preview** | Rendered Markdown view |
| **Split** | Side-by-side editor and preview |

### Working with Tags

- Click on existing tags to add/remove them from a note
- Use "Yeni etiket oluştur" to create custom tags with colors
- Filter notes by tags using the sidebar tag filter

### Dark Mode

- Click the theme toggle in the footer to switch between Light, Dark, and System modes
- System mode automatically follows your OS preference

### Search

Use the search bar in the sidebar to find notes by title or content.

## How It Works?

### State Management

The application uses Zustand with persist middleware for centralized state management:

```typescript
interface NotesState {
  notes: Note[];
  tags: Tag[];
  tagsById: Record<string, Tag>; // O(1) tag lookup
  searchQuery: string;
  selectedTags: string[];
  // ... actions
}
```

### Optimized Selectors

Components subscribe only to the state they need using selectors:

```typescript
// Selector for filtered notes
export const selectFilteredNotes = (state: NotesState) => {
  const { notes, searchQuery, selectedTags } = state;
  return notes.filter(/* filtering logic */);
};
```

### Auto-Save Implementation

Notes are automatically saved using a custom debounce hook with status tracking:

```typescript
const { save, status, error } = useAutoSave(handleSave, 1000);
// status: 'idle' | 'saving' | 'saved' | 'error'
```

### Data Persistence

All data is stored in localStorage with Zustand persist middleware:

```typescript
persist(
  (set) => ({ /* store */ }),
  {
    name: 'notes-storage',
    partialize: (state) => ({ notes: state.notes, tags: state.tags }),
  }
)
```

### Theme Management

Dark mode is managed through a dedicated theme store:

```typescript
type Theme = 'light' | 'dark' | 'system';
// Applies 'dark' class to document for Tailwind dark mode
```

## Project Structure

```
src/
├── components/
│   ├── error/         # Error boundary component
│   ├── layout/        # Layout components (Sidebar, SplitLayout, Footer)
│   ├── notes/         # Note components (NoteCard, NoteEditor, NoteForm)
│   ├── tags/          # Tag components (TagBadge, TagSelector)
│   └── ui/            # Base UI components (Button, Input, Modal, Toast, etc.)
├── hooks/             # Custom hooks (useAutoSave, useLocalStorage, useKeyboardShortcuts)
├── pages/             # Page components (NotesListPage, NoteDetailPage, NotFoundPage)
├── store/             # Zustand stores (useNotesStore, useThemeStore, useUIStore)
├── types/             # TypeScript type definitions
├── utils/             # Utility functions (storage, validation)
├── App.tsx            # Main application component with routing
├── main.tsx           # Entry point with providers
└── index.css          # Global styles and Tailwind imports
```

## Customization

### Adding New Tag Colors

Edit the tag color options in `src/types/index.ts`:

```typescript
export const TAG_COLORS = [
  '#ef4444', // red
  '#f97316', // orange
  '#eab308', // yellow
  // Add your custom colors here
] as const;
```

### Changing Auto-Save Delay

Modify the debounce delay in the NoteDetailPage component:

```typescript
const AUTOSAVE_DELAY = 1000; // Change to your preferred delay in ms
```

### Styling

The application uses Tailwind CSS with dark mode support. Customize the theme in `tailwind.config.js`:

```javascript
module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          // Your custom primary colors
        }
      }
    }
  }
}
```

### Adding Keyboard Shortcuts

Add new shortcuts in `src/hooks/useKeyboardShortcuts.ts`:

```typescript
{
  key: 'e',
  ctrl: true,
  description: 'Export note',
  action: () => handleExport(),
}
```

## Features in Detail

### Completed Features

- ✅ Create, edit, and delete notes
- ✅ Markdown editor with live preview
- ✅ Tag creation and management with colors
- ✅ Search functionality
- ✅ Auto-save with debounce and status indicator
- ✅ Responsive split layout
- ✅ localStorage persistence with Zustand persist
- ✅ Tag-based filtering
- ✅ Dark mode with system preference detection
- ✅ Keyboard shortcuts with visual guide
- ✅ Error boundaries for graceful error handling
- ✅ Toast notifications for user feedback
- ✅ Accessible modals and confirm dialogs
- ✅ Code splitting with lazy loading
- ✅ Optimized state management with selectors
- ✅ 404 Not Found page

### Future Features

- [ ] Cloud sync with user accounts
- [ ] Note sharing and collaboration
- [ ] Export notes to PDF/HTML
- [ ] Rich text editor option
- [ ] Note templates
- [ ] Note pinning and favorites
- [ ] Drag and drop note reordering

## Deployment

### Netlify

1. Push your project to GitHub
2. Create a new site on Netlify
3. Connect your GitHub repository
4. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
5. Deploy

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Create production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint for code quality |

## Browser Support

Supports the last 2 versions of modern browsers:

- Google Chrome
- Mozilla Firefox
- Safari
- Microsoft Edge

## Performance

- **Code Splitting**: Pages are lazy-loaded for faster initial load
- **Memoization**: Components use `memo`, `useMemo`, and `useCallback`
- **Optimized Selectors**: Zustand selectors prevent unnecessary re-renders
- **Debounced Updates**: Auto-save and markdown preview are debounced

## Accessibility

- **Focus Management**: Modals trap focus and restore on close
- **Keyboard Navigation**: Full keyboard support with shortcuts
- **ARIA Labels**: Proper labeling for screen readers
- **Color Contrast**: Dark mode maintains WCAG contrast ratios

## Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'feat: add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Commit Message Format

| Prefix | Description |
|--------|-------------|
| `feat:` | New feature |
| `fix:` | Bug fix |
| `docs:` | Documentation changes |
| `style:` | Code style changes |
| `refactor:` | Code refactoring |
| `test:` | Adding or updating tests |
| `chore:` | Maintenance tasks |

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Developer

**Serkanby**

- Website: [serkanbayraktar.com](https://serkanbayraktar.com/)
- GitHub: [@Serkanbyx](https://github.com/Serkanbyx)
- Email: serkanbyx1@gmail.com

## Acknowledgments

- [React](https://react.dev/) - UI Library
- [Tailwind CSS](https://tailwindcss.com/) - CSS Framework
- [Zustand](https://zustand-demo.pmnd.rs/) - State Management
- [Vite](https://vitejs.dev/) - Build Tool
- [react-markdown](https://github.com/remarkjs/react-markdown) - Markdown Renderer

## Contact

- **Issues**: [GitHub Issues](https://github.com/Serkanbyx/notes-web-app/issues)
- **Email**: serkanbyx1@gmail.com
- **Website**: [serkanbayraktar.com](https://serkanbayraktar.com/)

---

⭐ If you like this project, don't forget to give it a star!
