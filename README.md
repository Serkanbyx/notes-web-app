# 📝 Notes Web App

A modern, responsive note-taking application with Markdown support, a tagging system, dark mode, and auto-save functionality. Organize your notes efficiently with a beautiful split-layout interface, fully offline and local-first.

[![Created by Serkanby](https://img.shields.io/badge/Created%20by-Serkanby-blue?style=flat-square)](https://serkanbayraktar.com/)
[![GitHub](https://img.shields.io/badge/GitHub-Serkanbyx-181717?style=flat-square&logo=github)](https://github.com/Serkanbyx)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

## Features

- **CRUD Operations**: Create, read, update, and delete notes seamlessly
- **Markdown Support**: Rich text formatting with a live, debounced Markdown preview
- **Tagging System**: Categorize and organize your notes with custom colored tags
- **Smart Search**: Quick search across note titles and content
- **Auto-Save**: Automatic saving with a 1-second debounce delay and visual save status
- **Dark Mode**: Light, Dark, and System themes with persistent preference
- **Keyboard Shortcuts**: Power-user shortcuts for creating, saving, searching, and switching editor modes
- **Offline Support**: Local-first approach using localStorage with cross-tab synchronization
- **Responsive Design**: Mobile and desktop friendly split layout
- **Multiple View Modes**: Write, Preview, and Split view for Markdown editing
- **Resilient UX**: Error boundary, toast notifications, lazy-loaded pages, and a custom 404 page

## Live Demo

[🚀 View Live Demo](https://your-demo-url.netlify.app)

## Documentation

- [Step-by-Step Build Guide](docs/build-guide.md) — the original roadmap used to build this project, phase by phase.

## Screenshots

### Main Screen

The sidebar displays all your notes with search functionality and tag filters.

### Note Editor

Full-featured Markdown editor with real-time preview, tag management, and a save-status indicator.

### Split View

Side-by-side editing and preview for the best writing experience, in both light and dark themes.

## Technologies

- **React 18**: Modern UI library with hooks and functional components
- **TypeScript**: Type-safe development with enhanced IDE support
- **Vite**: Lightning-fast build tool and development server
- **Zustand**: Lightweight state management with `persist` and `devtools` middleware
- **React Hook Form**: Performant form handling with minimal re-renders
- **Zod**: TypeScript-first schema validation
- **React Router v6**: Declarative routing with lazy-loaded routes
- **Tailwind CSS**: Utility-first CSS framework with class-based dark mode
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

1. **Create a New Note**: Click the "Yeni Not" button in the sidebar (or press `Ctrl/Cmd + N`)
2. **Enter Title**: Provide a descriptive title for your note (required)
3. **Add Tags**: Select existing tags or create new ones to categorize your note
4. **Write Content**: Use Markdown syntax for rich text formatting
5. **Auto-Save**: Your note is automatically saved as you type
6. **Switch Theme**: Toggle between Light, Dark, and System themes from the sidebar footer

### Markdown Editor Modes

| Mode | Description |
|------|-------------|
| **Write** | Plain text editing mode |
| **Preview** | Rendered Markdown view (debounced) |
| **Split** | Side-by-side editor and preview |

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + N` | Create a new note |
| `Ctrl/Cmd + S` | Save the current note |
| `Ctrl/Cmd + F` | Focus the search input |
| `Ctrl/Cmd + Shift + D` | Delete the current note |
| `Ctrl/Cmd + /` | Show the keyboard shortcuts dialog |
| `Ctrl/Cmd + 1 / 2 / 3` | Switch between Write / Preview / Split modes |

### Working with Tags

- Click on existing tags to add/remove them from a note
- Use "Create new tag" to create custom colored tags
- Filter notes by tags using the sidebar tag filter

### Search

Use the search bar in the sidebar to find notes by title or content.

## How It Works?

### State Management

The application uses Zustand with `persist` and `devtools` middleware for centralized, auto-persisted state:

```typescript
interface NotesState {
  notes: Note[];
  tags: Tag[];
  tagsById: Record<string, Tag>; // O(1) tag lookup
  searchQuery: string;
  selectedTags: string[];
  // ...actions and selectors
}
```

Optimized selectors (e.g. `selectFilteredNotes`, `selectTagsById`) keep component re-renders minimal.

### Auto-Save Implementation

Notes are automatically saved using a custom debounce hook with status tracking and error handling:

```typescript
const { saveNow, status, error } = useAutoSave(handleSave, formData, 1000);
```

### Theme Management

A dedicated theme store applies a `dark` class on the document root and persists the choice, supporting Light, Dark, and System (with live OS preference detection):

```typescript
type Theme = 'light' | 'dark' | 'system';
```

### Data Persistence

All data is stored in localStorage for offline-first functionality, including cross-tab synchronization and quota handling.

## Project Structure

```
src/
├── components/
│   ├── error/         # ErrorBoundary
│   ├── layout/        # Layout components (Sidebar, SplitLayout, Footer)
│   ├── notes/         # Note components (NoteCard, NoteEditor, NoteForm)
│   ├── tags/          # Tag components (TagBadge, TagSelector)
│   └── ui/            # Base UI (Button, Input, SearchBar, Modal, Toast, ThemeToggle, ...)
├── hooks/             # Custom hooks (useAutoSave, useLocalStorage, useKeyboardShortcuts)
├── pages/             # Page components (NotesListPage, NoteDetailPage, NotFoundPage)
├── store/             # Zustand stores (useNotesStore, useThemeStore, useUIStore)
├── types/             # TypeScript type definitions
├── utils/             # Utility functions (storage, validation)
├── App.tsx            # Main application component
├── main.tsx           # Entry point
└── index.css          # Global styles and Tailwind imports
```

## Customization

### Adding New Tag Colors

Edit the `TAG_COLORS` array in `src/types/index.ts`:

```typescript
export const TAG_COLORS = [
  '#ef4444', // red
  '#3b82f6', // blue
  // Add your custom colors here
] as const;
```

### Changing Auto-Save Delay

Modify the debounce delay where `useAutoSave` is used in `NoteDetailPage`:

```typescript
const { saveNow } = useAutoSave(handleAutoSave, formData, 1000); // ms
```

### Styling

The application uses Tailwind CSS with class-based dark mode. Customize the theme in `tailwind.config.js`:

```javascript
export default {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          // Your custom primary colors
        },
      },
    },
  },
};
```

## Features in Detail

### Completed Features

- ✅ Create, edit, and delete notes
- ✅ Markdown editor with live, debounced preview
- ✅ Tag creation, coloring, and management
- ✅ Search functionality
- ✅ Auto-save with debounce and save-status indicator
- ✅ Responsive split layout
- ✅ localStorage persistence with cross-tab sync
- ✅ Tag-based filtering
- ✅ Dark mode (Light / Dark / System)
- ✅ Keyboard shortcuts
- ✅ Error boundary, toast notifications, and lazy-loaded routes

### Future Features

- 🔮 Cloud sync with user accounts
- 🔮 Note sharing and collaboration
- 🔮 Export notes to PDF/HTML
- 🔮 Rich text (WYSIWYG) editor option
- 🔮 Note templates
- 🔮 Accessible confirm dialogs replacing native prompts

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

## Contributing

Contributions are welcome! Please read our [Contributing Guide](.github/CONTRIBUTING.md) and [Code of Conduct](.github/CODE_OF_CONDUCT.md) before getting started.

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
