# 📝 Notes Web App

A modern, responsive note-taking application with Markdown support, tagging system, and auto-save functionality. Organize your notes efficiently with a beautiful split-layout interface.

[![Created by Serkanby](https://img.shields.io/badge/Created%20by-Serkanby-blue?style=flat-square)](https://serkanbayraktar.com/)
[![GitHub](https://img.shields.io/badge/GitHub-Serkanbyx-181717?style=flat-square&logo=github)](https://github.com/Serkanbyx)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

## Features

- **CRUD Operations**: Create, read, update, and delete notes seamlessly
- **Markdown Support**: Rich text formatting with live Markdown preview
- **Tagging System**: Categorize and organize your notes with custom tags
- **Smart Search**: Quick search across titles and content
- **Auto-Save**: Automatic saving with 1-second debounce delay
- **Offline Support**: Local-first approach using localStorage
- **Responsive Design**: Mobile and desktop friendly split layout
- **Multiple View Modes**: Write, Preview, and Split view for Markdown editing

## Live Demo

[🚀 View Live Demo](https://your-demo-url.netlify.app)

## Screenshots

### Main Screen

The sidebar displays all your notes with search functionality and tag filters.

### Note Editor

Full-featured Markdown editor with real-time preview and tag management.

### Split View

Side-by-side editing and preview for the best writing experience.

## Technologies

- **React 18**: Modern UI library with hooks and functional components
- **TypeScript**: Type-safe development with enhanced IDE support
- **Vite**: Lightning-fast build tool and development server
- **Zustand**: Lightweight and flexible state management
- **React Hook Form**: Performant form handling with minimal re-renders
- **Zod**: TypeScript-first schema validation
- **React Router v6**: Declarative routing for single-page applications
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
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

1. **Create a New Note**: Click the "Yeni Not" button in the sidebar
2. **Enter Title**: Provide a descriptive title for your note (required)
3. **Add Tags**: Select existing tags or create new ones to categorize your note
4. **Write Content**: Use Markdown syntax for rich text formatting
5. **Auto-Save**: Your note is automatically saved as you type

### Markdown Editor Modes

| Mode | Description |
|------|-------------|
| **Write** | Plain text editing mode |
| **Preview** | Rendered Markdown view |
| **Split** | Side-by-side editor and preview |

### Working with Tags

- Click on existing tags to add/remove them from a note
- Use "Yeni etiket oluştur" to create custom tags
- Filter notes by tags using the sidebar tag filter

### Search

Use the search bar in the sidebar to find notes by title or content.

## How It Works?

### State Management

The application uses Zustand for centralized state management:

```typescript
interface NotesState {
  notes: Note[];
  tags: Tag[];
  searchQuery: string;
  selectedTags: string[];
  // ... actions
}
```

### Auto-Save Implementation

Notes are automatically saved using a custom debounce hook:

```typescript
const useAutoSave = (value: string, delay: number) => {
  // Debounced save logic with 1 second delay
};
```

### Data Persistence

All data is stored in localStorage for offline-first functionality:

```typescript
const useLocalStorage = <T>(key: string, initialValue: T) => {
  // localStorage sync with React state
};
```

## Project Structure

```
src/
├── components/
│   ├── layout/        # Layout components (Sidebar, SplitLayout, Footer)
│   ├── notes/         # Note components (NoteCard, NoteEditor, NoteForm)
│   ├── tags/          # Tag components (TagBadge, TagSelector)
│   └── ui/            # Base UI components (Button, Input, SearchBar)
├── hooks/             # Custom hooks (useAutoSave, useLocalStorage)
├── pages/             # Page components (NotesListPage, NoteDetailPage)
├── store/             # Zustand store (useNotesStore)
├── types/             # TypeScript type definitions
├── utils/             # Utility functions (storage, validation)
├── App.tsx            # Main application component
├── main.tsx           # Entry point
└── index.css          # Global styles and Tailwind imports
```

## Customization

### Adding New Tag Colors

Edit the tag color options in the TagSelector component:

```typescript
const tagColors = [
  { name: 'blue', value: '#3B82F6' },
  { name: 'green', value: '#10B981' },
  // Add your custom colors here
];
```

### Changing Auto-Save Delay

Modify the debounce delay in the NoteEditor component:

```typescript
const AUTOSAVE_DELAY = 1000; // Change to your preferred delay in ms
```

### Styling

The application uses Tailwind CSS. Customize the theme in `tailwind.config.js`:

```javascript
module.exports = {
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

## Features in Detail

### Completed Features

- ✅ Create, edit, and delete notes
- ✅ Markdown editor with live preview
- ✅ Tag creation and management
- ✅ Search functionality
- ✅ Auto-save with debounce
- ✅ Responsive split layout
- ✅ localStorage persistence
- ✅ Tag-based filtering

### Future Features

- [ ] Cloud sync with user accounts
- [ ] Note sharing and collaboration
- [ ] Export notes to PDF/HTML
- [ ] Rich text editor option
- [ ] Note templates
- [ ] Dark mode support
- [ ] Keyboard shortcuts

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
