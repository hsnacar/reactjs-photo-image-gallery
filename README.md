# reactjs-photo-image-gallery

[![npm version](https://img.shields.io/npm/v/reactjs-photo-image-gallery.svg?style=flat-square)](https://www.npmjs.com/package/reactjs-photo-image-gallery)
[![npm downloads](https://img.shields.io/npm/dm/reactjs-photo-image-gallery.svg?style=flat-square)](https://www.npmjs.com/package/reactjs-photo-image-gallery)
[![bundle size](https://img.shields.io/bundlephobia/minzip/reactjs-photo-image-gallery?style=flat-square)](https://bundlephobia.com/package/reactjs-photo-image-gallery)
[![license](https://img.shields.io/npm/l/reactjs-photo-image-gallery.svg?style=flat-square)](https://github.com/hsnacar/reactjs-photo-image-gallery/blob/main/LICENSE)

A lightweight, responsive, and customizable Photo Image Gallery / Carousel component for React with full **TypeScript** support.

- ⚡ **Ultra lightweight**: Zero external runtime dependencies, under ~5 KB gzipped.
- 🛡️ **Full TypeScript Support**: Built-in comprehensive type definitions.
- 🎯 **Interactive Controls**: Previous/Next navigation arrows, dot pagination, and optional thumbnail strip.
- 📱 **Mobile & Keyboard Ready**: Touch swipe gestures and Left/Right arrow key navigation.
- 🔒 **Memory-Safe**: Cleaned up timer intervals to prevent memory leaks.
- 🎨 **Modern & Clean**: Smooth fade transitions, modern theme overlay (Dark, Light, Auto).
- ⏸️ **Pause on Hover**: Automatically pauses slideshow when user hovers over an image.
- 🔄 **100% Backward Compatible**: Supports both new modern prop API and legacy `pi_gallery` props.

---

## Installation

```bash
npm install reactjs-photo-image-gallery
# or
yarn add reactjs-photo-image-gallery
# or
pnpm add reactjs-photo-image-gallery
```

> **Note**: Don't forget to import the CSS in your app or entry file:
> ```typescript
> import 'reactjs-photo-image-gallery/dist/index.css';
> ```

---

## Quick Start (Modern API)

```tsx
import React from 'react';
import { PhotoGallery } from 'reactjs-photo-image-gallery';
import 'reactjs-photo-image-gallery/dist/index.css';

const images = [
  {
    src: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200',
    title: 'Majestic Mountains',
    alt: 'Mountains',
    url: 'https://example.com/mountains',
    target: '_blank',
  },
  {
    src: 'https://images.unsplash.com/photo-1511497584788-87676104235f?w=1200',
    title: 'Serene River Flow',
    alt: 'River',
  },
  {
    src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200',
    title: 'Golden Sunset',
    alt: 'Sunset',
  },
];

export default function App() {
  return (
    <div style={{ maxWidth: '800px', margin: '40px auto' }}>
      {/* With Navigation Arrows and Thumbnails */}
      <PhotoGallery
        images={images}
        interval={4000}
        width="100%"
        height="450px"
        showArrows={true}
        showThumbnails={true}
        pauseOnHover={true}
        theme="dark"
      />
    </div>
  );
}
```

---

## Props Reference

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `images` (or `items`) | `GalleryItem[]` | `[]` | List of gallery slides to render |
| `interval` | `number` | `5000` | Transition duration in milliseconds |
| `width` | `string \| number` | `undefined` | Gallery container max-width or width |
| `height` | `string \| number` | `undefined` | Gallery container max-height or height |
| `showArrows` | `boolean` | `true` | Show Prev/Next navigation arrow buttons |
| `showIndicators` | `boolean` | `true` | Show dot pagination indicators |
| `showThumbnails` | `boolean` | `false` | Show interactive thumbnail preview strip below slider |
| `thumbnailHeight`| `string \| number` | `60` | Height in pixels or CSS value of thumbnail strip items |
| `keyboardNav` | `boolean` | `true` | Navigate with Left and Right arrow keys |
| `enableSwipe` | `boolean` | `true` | Enable touch swipe gestures on mobile |
| `autoPlay` | `boolean` | `true` | Automatically advance slides |
| `pauseOnHover` | `boolean` | `true` | Pause slideshow on mouse hover |
| `showTitle` | `boolean` | `true` | Show or hide image title overlays |
| `theme` | `'auto' \| 'light' \| 'dark'` | `'auto'` | Overlay background/color theme |
| `objectFit` | `'cover' \| 'contain' \| ...` | `'cover'` | CSS `object-fit` property of the images |
| `className` | `string` | `undefined` | Custom class name for the wrapper |
| `style` | `CSSProperties` | `undefined` | Custom inline style for the wrapper |
| `onSlideChange` | `(index, item) => void` | `undefined` | Callback invoked when active slide changes |
| `pi_gallery` | `PhotoGalleryLegacyProps`| `undefined` | Legacy v1 configuration object |

### `GalleryItem` Structure

```typescript
interface GalleryItem {
  src: string;              // Image URL (required)
  thumbnail?: string;       // Optional custom thumbnail image URL
  alt?: string;             // Image accessibility alt text
  title?: string;           // Caption or title displayed over slide
  url?: string;             // Optional hyperlink destination
  target?: string;          // Link target: '_blank', '_self', etc.
  url_enable?: boolean;     // Legacy flag: false disables navigation
}
```

---

## Backward Compatibility (Legacy v1 Support)

Existing projects using `PI_Gallery` and `pi_gallery` prop continue to work out of the box with arrows and indicators:

```tsx
import { PI_Gallery } from 'reactjs-photo-image-gallery';
import 'reactjs-photo-image-gallery/dist/index.css';

const pi_gallery = {
  width: "500px",
  height: "300px",
  timer: 5000,
  pi_list: [
    {
      src: "/images/photo-1.jpg",
      alt: "Photo 1",
      url_enable: true,
      url: "#",
      target: "_blank",
      title: "Photo 1 Title",
    },
    {
      src: "/images/photo-2.jpg",
      alt: "Photo 2",
      url_enable: false,
      title: "Photo 2 Title",
    },
  ],
};

function App() {
  return <PI_Gallery pi_gallery={pi_gallery} />;
}
```

---

## Author & Socials

- **Hasan Acar**
- GitHub: [@hsnacar](https://github.com/hsnacar)
- LinkedIn: [Hasan Acar](https://www.linkedin.com/in/hasan-acar-018007247/)

## License

[MIT](LICENSE)
