import type { CSSProperties } from 'react';

export interface GalleryItem {
  /** Image source URL */
  src: string;
  /** Optional custom thumbnail URL (falls back to src if not provided) */
  thumbnail?: string;
  /** Alternative text for image accessibility */
  alt?: string;
  /** Optional caption / title overlaid on image */
  title?: string;
  /** Hyperlink URL if the slide is clickable */
  url?: string;
  /** Anchor target ('_blank', '_self', etc.) */
  target?: '_blank' | '_self' | '_parent' | '_top' | string;
  /** Legacy flag: If false, clicking will not navigate even if url is present */
  url_enable?: boolean;
}

export interface PhotoGalleryLegacyProps {
  width?: string | number;
  height?: string | number;
  timer?: number;
  pi_list?: GalleryItem[];
}

export interface PhotoGalleryProps {
  /**
   * List of images/slides to display (Modern API).
   */
  images?: GalleryItem[];

  /**
   * Alias for `images`.
   */
  items?: GalleryItem[];

  /**
   * Transition interval in milliseconds between slides.
   * @default 5000
   */
  interval?: number;

  /**
   * Container maximum width or fixed width (e.g. '600px', '100%').
   */
  width?: string | number;

  /**
   * Container maximum height or fixed height (e.g. '400px').
   */
  height?: string | number;

  /**
   * Image object-fit strategy.
   * @default 'cover'
   */
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';

  /**
   * Whether the gallery should automatically transition slides.
   * @default true
   */
  autoPlay?: boolean;

  /**
   * Whether to pause autoplay when the user hovers over the gallery.
   * @default true
   */
  pauseOnHover?: boolean;

  /**
   * Whether to show navigation arrow buttons (Prev / Next).
   * @default true
   */
  showArrows?: boolean;

  /**
   * Whether to show dot pagination indicators.
   * @default true
   */
  showIndicators?: boolean;

  /**
   * Whether to show interactive thumbnail strip below the slider.
   * @default false
   */
  showThumbnails?: boolean;

  /**
   * Height of thumbnail items if showThumbnails is enabled.
   * @default '60px'
   */
  thumbnailHeight?: string | number;

  /**
   * Enable keyboard navigation (ArrowLeft & ArrowRight keys).
   * @default true
   */
  keyboardNav?: boolean;

  /**
   * Enable touch swipe gestures on mobile devices.
   * @default true
   */
  enableSwipe?: boolean;

  /**
   * Whether to show caption titles on slides.
   * @default true
   */
  showTitle?: boolean;

  /**
   * Color theme for overlay title and controls:
   * - 'auto': Uses system prefers-color-scheme
   * - 'light': Light background with dark text
   * - 'dark': Dark background with light text
   * @default 'auto'
   */
  theme?: 'auto' | 'light' | 'dark';

  /**
   * Additional custom CSS class name for container.
   */
  className?: string;

  /**
   * Additional inline styles for container.
   */
  style?: CSSProperties;

  /**
   * Callback invoked whenever active slide changes.
   */
  onSlideChange?: (index: number, item: GalleryItem) => void;

  /**
   * Legacy prop format for v1 backward compatibility:
   * `<PI_Gallery pi_gallery={{ pi_list: [...], timer: 5000, width: "500px", height: "300px" }} />`
   */
  pi_gallery?: PhotoGalleryLegacyProps;
}
