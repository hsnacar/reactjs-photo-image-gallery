import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { PhotoGalleryProps, GalleryItem } from './types';
import './PhotoGallery.css';

export const PhotoGallery: React.FC<PhotoGalleryProps> = (props) => {
  // Resolve items from either modern props (images / items) or legacy prop (pi_gallery.pi_list)
  const items: GalleryItem[] =
    props.images ??
    props.items ??
    props.pi_gallery?.pi_list ??
    [];

  // Resolve interval from modern interval or legacy pi_gallery.timer (default 5000ms)
  const interval = props.interval ?? props.pi_gallery?.timer ?? 5000;

  // Resolve dimensions
  const width = props.width ?? props.pi_gallery?.width;
  const height = props.height ?? props.pi_gallery?.height;

  const autoPlay = props.autoPlay ?? true;
  const pauseOnHover = props.pauseOnHover ?? true;
  const showArrows = props.showArrows ?? true;
  const showIndicators = props.showIndicators ?? true;
  const showThumbnails = props.showThumbnails ?? false;
  const thumbnailHeight = props.thumbnailHeight ?? 60;
  const keyboardNav = props.keyboardNav ?? true;
  const enableSwipe = props.enableSwipe ?? true;
  const showTitle = props.showTitle ?? true;
  const objectFit = props.objectFit ?? 'cover';
  const theme = props.theme ?? 'auto';

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const touchStartXRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const activeThumbRef = useRef<HTMLButtonElement>(null);
  const onSlideChangeRef = useRef(props.onSlideChange);

  useEffect(() => {
    onSlideChangeRef.current = props.onSlideChange;
  }, [props.onSlideChange]);

  const total = items.length;

  const goToSlide = useCallback(
    (index: number) => {
      let targetIndex = index;
      if (index < 0) {
        targetIndex = total - 1;
      } else if (index >= total) {
        targetIndex = 0;
      }
      setCurrentIndex(targetIndex);
      if (onSlideChangeRef.current && items[targetIndex]) {
        onSlideChangeRef.current(targetIndex, items[targetIndex]);
      }
    },
    [total, items]
  );

  const goToNext = useCallback(() => {
    goToSlide(currentIndex + 1);
  }, [goToSlide, currentIndex]);

  const goToPrev = useCallback(() => {
    goToSlide(currentIndex - 1);
  }, [goToSlide, currentIndex]);

  // Auto-play timer effect with memory leak cleanup
  useEffect(() => {
    if (!autoPlay || total <= 1 || (pauseOnHover && isHovered)) {
      return;
    }

    const timer = setInterval(() => {
      goToNext();
    }, interval);

    return () => {
      clearInterval(timer);
    };
  }, [autoPlay, total, interval, pauseOnHover, isHovered, goToNext]);

  // Handle out-of-bounds index if items change dynamically
  useEffect(() => {
    if (currentIndex >= total && total > 0) {
      setCurrentIndex(0);
    }
  }, [total, currentIndex]);

  // Scroll active thumbnail into view
  useEffect(() => {
    if (showThumbnails && activeThumbRef.current) {
      activeThumbRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'nearest',
      });
    }
  }, [currentIndex, showThumbnails]);

  // Keyboard navigation handler
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!keyboardNav || total <= 1) return;
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      goToPrev();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      goToNext();
    }
  };

  // Touch swipe gestures
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!enableSwipe || total <= 1) return;
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!enableSwipe || total <= 1 || touchStartXRef.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartXRef.current - touchEndX;

    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        goToNext();
      } else {
        goToPrev();
      }
    }
    touchStartXRef.current = null;
  };

  // Fallback for empty item list
  if (total === 0) {
    return (
      <div
        className={`rpi-gallery pi_gallery rpi-gallery-empty ${props.className || ''}`.trim()}
        style={{
          maxWidth: width,
          maxHeight: height,
          ...props.style,
        }}
      >
        <span>No images provided</span>
      </div>
    );
  }

  const currentItem = items[currentIndex];
  if (!currentItem) {
    return null;
  }

  const isClickable = Boolean(currentItem.url && currentItem.url_enable !== false);

  const imageElement = (
    <img
      className="rpi-gallery-img pi_gallery_img"
      src={currentItem.src}
      alt={currentItem.alt || currentItem.title || `Gallery slide ${currentIndex + 1}`}
      style={{ objectFit }}
    />
  );

  const titleElement = showTitle && currentItem.title ? (
    <span className="rpi-gallery-title pi_gallery_title">
      {currentItem.title}
    </span>
  ) : null;

  const content = isClickable ? (
    <a
      href={currentItem.url}
      target={currentItem.target || '_self'}
      rel={currentItem.target === '_blank' ? 'noreferrer noopener' : undefined}
      className="rpi-gallery-link"
    >
      {imageElement}
      {titleElement}
    </a>
  ) : (
    <>
      {imageElement}
      {titleElement}
    </>
  );

  return (
    <div
      className={`rpi-gallery-wrapper ${props.className || ''}`.trim()}
      style={{
        maxWidth: width,
        ...props.style,
      }}
    >
      <div
        ref={containerRef}
        tabIndex={keyboardNav ? 0 : undefined}
        className={`rpi-gallery pi_gallery rpi-theme-${theme} ${titleElement ? 'rpi-has-title' : ''}`}
        style={{
          maxHeight: height,
          height: height ? '100%' : undefined,
        }}
        onMouseEnter={() => pauseOnHover && setIsHovered(true)}
        onMouseLeave={() => pauseOnHover && setIsHovered(false)}
        onKeyDown={handleKeyDown}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div key={currentIndex} className="rpi-gallery-slide pi_gallery_slide">
          {content}
        </div>

        {/* Previous Arrow */}
        {showArrows && total > 1 && (
          <button
            type="button"
            className="rpi-gallery-arrow rpi-gallery-arrow-prev"
            aria-label="Previous slide"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              goToPrev();
            }}
          >
            <svg viewBox="0 0 24 24">
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
            </svg>
          </button>
        )}

        {/* Next Arrow */}
        {showArrows && total > 1 && (
          <button
            type="button"
            className="rpi-gallery-arrow rpi-gallery-arrow-next"
            aria-label="Next slide"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              goToNext();
            }}
          >
            <svg viewBox="0 0 24 24">
              <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
            </svg>
          </button>
        )}

        {/* Dot Indicators */}
        {showIndicators && total > 1 && (
          <div className="rpi-gallery-indicators" role="tablist">
            {items.map((_, idx) => (
              <button
                key={idx}
                type="button"
                role="tab"
                aria-selected={idx === currentIndex}
                aria-label={`Go to slide ${idx + 1}`}
                className={`rpi-gallery-dot ${idx === currentIndex ? 'rpi-dot-active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  goToSlide(idx);
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnail Strip */}
      {showThumbnails && total > 1 && (
        <div className="rpi-gallery-thumbnails" role="tablist" aria-label="Thumbnails">
          {items.map((item, idx) => {
            const isActive = idx === currentIndex;
            return (
              <button
                key={idx}
                ref={isActive ? activeThumbRef : undefined}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-label={`Thumbnail ${idx + 1}`}
                className={`rpi-gallery-thumb-btn ${isActive ? 'rpi-thumb-active' : ''}`}
                style={{
                  height: typeof thumbnailHeight === 'number' ? `${thumbnailHeight}px` : thumbnailHeight,
                  width: typeof thumbnailHeight === 'number' ? `${thumbnailHeight * 1.5}px` : `calc(${thumbnailHeight} * 1.5)`,
                }}
                onClick={() => goToSlide(idx)}
              >
                <img
                  src={item.thumbnail || item.src}
                  alt={item.alt || `Thumbnail ${idx + 1}`}
                  className="rpi-gallery-thumb-img"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

// Backward-compatibility export alias
export const PI_Gallery = PhotoGallery;
