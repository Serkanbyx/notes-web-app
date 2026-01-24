# Notes Web App

Modern, responsive bir not alma uygulaması. Markdown desteği, etiketleme sistemi ve otomatik kaydetme özellikleri ile notlarınızı düzenleyin.

## Özellikler

- **CRUD İşlemleri**: Not oluşturma, okuma, güncelleme ve silme
- **Markdown Desteği**: Zengin metin formatlaması için Markdown editörü
- **Etiket Sistemi**: Notlarınızı etiketlerle kategorize edin
- **Arama**: Başlık ve içerik üzerinde hızlı arama
- **Otomatik Kaydetme**: 1 saniye gecikmeli debounce ile otomatik kayıt
- **Çevrimdışı Çalışma**: localStorage ile local-first yaklaşım
- **Responsive Tasarım**: Mobil ve masaüstü uyumlu split layout

## Teknolojiler

- **React 18** + **TypeScript**
- **Vite** - Build tool
- **Zustand** - State management
- **React Hook Form** + **Zod** - Form yönetimi ve validasyon
- **React Router v6** - Routing
- **Tailwind CSS** - Styling
- **react-markdown** - Markdown rendering

## Kurulum

```bash
# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat
npm run dev

# Production build oluştur
npm run build

# Build'i önizle
npm run preview
```

## Proje Yapısı

```
src/
├── components/
│   ├── layout/        # Layout componentleri (Sidebar, SplitLayout)
│   ├── notes/         # Not componentleri (NoteCard, NoteEditor, NoteForm)
│   ├── tags/          # Etiket componentleri (TagBadge, TagSelector)
│   └── ui/            # Temel UI componentleri (Button, Input, SearchBar)
├── hooks/             # Custom hooks (useAutoSave, useLocalStorage)
├── pages/             # Sayfa componentleri
├── store/             # Zustand store
├── types/             # TypeScript type definitions
├── utils/             # Yardımcı fonksiyonlar
├── App.tsx            # Ana uygulama componenti
├── main.tsx           # Entry point
└── index.css          # Global stiller
```

## Kullanım

### Yeni Not Oluşturma
1. Sol paneldeki "Yeni Not" butonuna tıklayın
2. Başlık girin (zorunlu)
3. Etiket ekleyin (opsiyonel)
4. Markdown formatında içerik yazın
5. Not otomatik olarak kaydedilir

### Markdown Editörü
- **Yaz**: Düz metin modu
- **Önizle**: Markdown render edilmiş görünüm
- **Bölünmüş**: Yan yana editör ve önizleme

### Etiketler
- Mevcut etiketlere tıklayarak nota ekleyin/çıkarın
- "Yeni etiket oluştur" ile özel etiketler ekleyin
- Sol panelden etiketlere göre filtreleyin

### Arama
Sol paneldeki arama çubuğunu kullanarak not başlığı ve içeriğinde arama yapın.

## Netlify Deploy

1. GitHub'a projeyi push edin
2. Netlify'da yeni site oluşturun
3. GitHub repository'yi bağlayın
4. Build ayarları:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Deploy edin

## Scripts

| Komut | Açıklama |
|-------|----------|
| `npm run dev` | Geliştirme sunucusu (port 3000) |
| `npm run build` | Production build |
| `npm run preview` | Build önizleme |

## Tarayıcı Desteği

Modern tarayıcıların son 2 versiyonu desteklenir:
- Chrome
- Firefox
- Safari
- Edge

## Lisans

MIT
