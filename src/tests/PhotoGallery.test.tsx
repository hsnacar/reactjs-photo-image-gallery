import '@testing-library/jest-dom/vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { PhotoGallery, PI_Gallery } from '../PhotoGallery';
import type { GalleryItem } from '../types';

const mockImages: GalleryItem[] = [
  {
    src: 'https://example.com/photo-1.jpg',
    title: 'First Slide Title',
    alt: 'First Slide Alt',
    url: 'https://example.com/link-1',
    target: '_blank',
  },
  {
    src: 'https://example.com/photo-2.jpg',
    title: 'Second Slide Title',
    alt: 'Second Slide Alt',
  },
  {
    src: 'https://example.com/photo-3.jpg',
    title: 'Third Slide Title',
    alt: 'Third Slide Alt',
    url: 'https://example.com/link-3',
    url_enable: false, // disabled link
  },
];

describe('PhotoGallery Component', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Edge Cases & Empty/Falsy Inputs', () => {
    it('renders empty fallback when images array is empty', () => {
      render(<PhotoGallery images={[]} />);
      expect(screen.getByTestId('rpi-gallery-empty')).toBeInTheDocument();
      expect(screen.getByText('No images provided')).toBeInTheDocument();
    });

    it('renders empty fallback when no props are provided', () => {
      render(<PhotoGallery />);
      expect(screen.getByTestId('rpi-gallery-empty')).toBeInTheDocument();
      expect(screen.getByText('No images provided')).toBeInTheDocument();
    });

    it('renders empty fallback when legacy pi_gallery is empty or has empty list', () => {
      const { rerender } = render(<PhotoGallery pi_gallery={{}} />);
      expect(screen.getByTestId('rpi-gallery-empty')).toBeInTheDocument();

      rerender(<PhotoGallery pi_gallery={{ pi_list: [] }} />);
      expect(screen.getByTestId('rpi-gallery-empty')).toBeInTheDocument();
    });

    it('handles single image without rendering arrows, dots or starting autoplay', () => {
      const singleImage = [mockImages[0]];
      render(<PhotoGallery images={singleImage} autoPlay={true} interval={2000} />);

      expect(screen.getByTestId('rpi-gallery-main-img')).toHaveAttribute('src', mockImages[0].src);
      expect(screen.queryByTestId('rpi-prev-button')).not.toBeInTheDocument();
      expect(screen.queryByTestId('rpi-next-button')).not.toBeInTheDocument();
      expect(screen.queryByTestId('rpi-indicators')).not.toBeInTheDocument();

      // Advancing timer should not change anything or throw
      act(() => {
        vi.advanceTimersByTime(5000);
      });
      expect(screen.getByTestId('rpi-gallery-main-img')).toHaveAttribute('src', mockImages[0].src);
    });

    it('gracefully handles dynamic list shrinkage when active index is out of bounds', () => {
      const onSlideChange = vi.fn();
      const { rerender } = render(
        <PhotoGallery images={mockImages} onSlideChange={onSlideChange} autoPlay={false} />
      );

      // Navigate to index 2 (Third slide)
      const nextBtn = screen.getByTestId('rpi-next-button');
      fireEvent.click(nextBtn); // index 1
      fireEvent.click(nextBtn); // index 2
      expect(screen.getByTestId('rpi-gallery-main-img')).toHaveAttribute('src', mockImages[2].src);

      // Now dramatically shrink images array to 1 element
      rerender(
        <PhotoGallery images={[mockImages[0]]} onSlideChange={onSlideChange} autoPlay={false} />
      );

      // Component should safely fall back to the available first slide without crashing or rendering null
      expect(screen.getByTestId('rpi-gallery-main-img')).toBeInTheDocument();
      expect(screen.getByTestId('rpi-gallery-main-img')).toHaveAttribute('src', mockImages[0].src);
    });

    it('handles negative or zero interval safely without freezing', () => {
      render(<PhotoGallery images={mockImages} interval={-100} autoPlay={true} />);
      expect(screen.getByTestId('rpi-gallery-main-img')).toBeInTheDocument();

      // Should default to safe 5000ms and not crash
      act(() => {
        vi.advanceTimersByTime(5000);
      });
      expect(screen.getByTestId('rpi-gallery-main-img')).toHaveAttribute('src', mockImages[1].src);
    });
  });

  describe('Rendering & Content', () => {
    it('renders the initial image, title, and alt text correctly', () => {
      render(<PhotoGallery images={mockImages} />);

      const img = screen.getByTestId('rpi-gallery-main-img');
      expect(img).toHaveAttribute('src', mockImages[0].src);
      expect(img).toHaveAttribute('alt', mockImages[0].alt);

      const title = screen.getByTestId('rpi-gallery-title');
      expect(title).toHaveTextContent(mockImages[0].title!);
    });

    it('hides titles when showTitle is false', () => {
      render(<PhotoGallery images={mockImages} showTitle={false} />);
      expect(screen.queryByTestId('rpi-gallery-title')).not.toBeInTheDocument();
    });

    it('renders hyperlink with security attributes when url is provided and target is _blank', () => {
      render(<PhotoGallery images={mockImages} />);

      const link = screen.getByTestId('rpi-gallery-link');
      expect(link).toHaveAttribute('href', mockImages[0].url);
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noreferrer noopener');
    });

    it('does not render link tag when url_enable is false', () => {
      render(<PhotoGallery images={mockImages} />);

      // Go to slide 3 where url_enable is false
      fireEvent.click(screen.getByTestId('rpi-dot-2'));

      expect(screen.queryByTestId('rpi-gallery-link')).not.toBeInTheDocument();
      expect(screen.getByTestId('rpi-gallery-main-img')).toHaveAttribute('src', mockImages[2].src);
    });
  });

  describe('Navigation Controls (Arrows & Looping)', () => {
    it('navigates forward with next button and loops back to first slide', () => {
      render(<PhotoGallery images={mockImages} autoPlay={false} />);

      const nextBtn = screen.getByTestId('rpi-next-button');

      // Click 1 -> slide 2
      fireEvent.click(nextBtn);
      expect(screen.getByTestId('rpi-gallery-main-img')).toHaveAttribute('src', mockImages[1].src);

      // Click 2 -> slide 3
      fireEvent.click(nextBtn);
      expect(screen.getByTestId('rpi-gallery-main-img')).toHaveAttribute('src', mockImages[2].src);

      // Click 3 -> loop back to slide 1
      fireEvent.click(nextBtn);
      expect(screen.getByTestId('rpi-gallery-main-img')).toHaveAttribute('src', mockImages[0].src);
    });

    it('navigates backward with prev button and loops to last slide from first slide', () => {
      render(<PhotoGallery images={mockImages} autoPlay={false} />);

      const prevBtn = screen.getByTestId('rpi-prev-button');

      // Click prev on first slide -> loops to last slide (slide 3)
      fireEvent.click(prevBtn);
      expect(screen.getByTestId('rpi-gallery-main-img')).toHaveAttribute('src', mockImages[2].src);

      // Click prev on slide 3 -> slide 2
      fireEvent.click(prevBtn);
      expect(screen.getByTestId('rpi-gallery-main-img')).toHaveAttribute('src', mockImages[1].src);
    });

    it('hides arrows when showArrows is false', () => {
      render(<PhotoGallery images={mockImages} showArrows={false} />);
      expect(screen.queryByTestId('rpi-prev-button')).not.toBeInTheDocument();
      expect(screen.queryByTestId('rpi-next-button')).not.toBeInTheDocument();
    });
  });

  describe('Indicators & Thumbnails', () => {
    it('jumps directly to chosen slide when dot indicator is clicked', () => {
      render(<PhotoGallery images={mockImages} autoPlay={false} />);

      const dot2 = screen.getByTestId('rpi-dot-1');
      fireEvent.click(dot2);

      expect(screen.getByTestId('rpi-gallery-main-img')).toHaveAttribute('src', mockImages[1].src);
      expect(dot2).toHaveClass('rpi-dot-active');
    });

    it('renders thumbnails and switches slide when thumbnail button is clicked', () => {
      render(<PhotoGallery images={mockImages} showThumbnails={true} autoPlay={false} />);

      expect(screen.getByTestId('rpi-thumbnails')).toBeInTheDocument();
      const thumb3 = screen.getByTestId('rpi-thumb-2');

      fireEvent.click(thumb3);
      expect(screen.getByTestId('rpi-gallery-main-img')).toHaveAttribute('src', mockImages[2].src);
      expect(thumb3).toHaveClass('rpi-thumb-active');
    });

    it('hides dot indicators when showIndicators is false', () => {
      render(<PhotoGallery images={mockImages} showIndicators={false} />);
      expect(screen.queryByTestId('rpi-indicators')).not.toBeInTheDocument();
    });
  });

  describe('Autoplay, Interval and Pause on Hover', () => {
    it('advances slides automatically according to interval', () => {
      render(<PhotoGallery images={mockImages} interval={3000} autoPlay={true} />);

      expect(screen.getByTestId('rpi-gallery-main-img')).toHaveAttribute('src', mockImages[0].src);

      act(() => {
        vi.advanceTimersByTime(3000);
      });
      expect(screen.getByTestId('rpi-gallery-main-img')).toHaveAttribute('src', mockImages[1].src);

      act(() => {
        vi.advanceTimersByTime(3000);
      });
      expect(screen.getByTestId('rpi-gallery-main-img')).toHaveAttribute('src', mockImages[2].src);
    });

    it('pauses autoplay when hovered and resumes when unhovered', () => {
      render(<PhotoGallery images={mockImages} interval={3000} autoPlay={true} pauseOnHover={true} />);

      const container = screen.getByTestId('rpi-gallery-container');

      // Mouse enters gallery
      fireEvent.mouseEnter(container);

      act(() => {
        vi.advanceTimersByTime(6000);
      });
      // Slide should remain at 0 because it is paused
      expect(screen.getByTestId('rpi-gallery-main-img')).toHaveAttribute('src', mockImages[0].src);

      // Mouse leaves gallery -> resumes
      fireEvent.mouseLeave(container);

      act(() => {
        vi.advanceTimersByTime(3000);
      });
      expect(screen.getByTestId('rpi-gallery-main-img')).toHaveAttribute('src', mockImages[1].src);
    });

    it('does not advance when autoPlay is false', () => {
      render(<PhotoGallery images={mockImages} interval={2000} autoPlay={false} />);

      act(() => {
        vi.advanceTimersByTime(10000);
      });
      expect(screen.getByTestId('rpi-gallery-main-img')).toHaveAttribute('src', mockImages[0].src);
    });
  });

  describe('Keyboard Navigation', () => {
    it('navigates with ArrowRight and ArrowLeft keys', () => {
      render(<PhotoGallery images={mockImages} autoPlay={false} keyboardNav={true} />);

      const container = screen.getByTestId('rpi-gallery-container');

      fireEvent.keyDown(container, { key: 'ArrowRight' });
      expect(screen.getByTestId('rpi-gallery-main-img')).toHaveAttribute('src', mockImages[1].src);

      fireEvent.keyDown(container, { key: 'ArrowLeft' });
      expect(screen.getByTestId('rpi-gallery-main-img')).toHaveAttribute('src', mockImages[0].src);
    });

    it('ignores arrow keys when keyboardNav is false', () => {
      render(<PhotoGallery images={mockImages} autoPlay={false} keyboardNav={false} />);

      const container = screen.getByTestId('rpi-gallery-container');

      fireEvent.keyDown(container, { key: 'ArrowRight' });
      expect(screen.getByTestId('rpi-gallery-main-img')).toHaveAttribute('src', mockImages[0].src);
    });
  });

  describe('Touch Swipe Gestures', () => {
    it('swipes left to go to next slide', () => {
      render(<PhotoGallery images={mockImages} autoPlay={false} enableSwipe={true} />);

      const container = screen.getByTestId('rpi-gallery-container');

      // Touch start at 200px
      fireEvent.touchStart(container, {
        touches: [{ clientX: 200 }],
      });

      // Touch end at 120px (moved left by 80px > 40px threshold)
      fireEvent.touchEnd(container, {
        changedTouches: [{ clientX: 120 }],
      });

      expect(screen.getByTestId('rpi-gallery-main-img')).toHaveAttribute('src', mockImages[1].src);
    });

    it('swipes right to go to previous slide', () => {
      render(<PhotoGallery images={mockImages} autoPlay={false} enableSwipe={true} />);

      const container = screen.getByTestId('rpi-gallery-container');

      // Touch start at 100px
      fireEvent.touchStart(container, {
        touches: [{ clientX: 100 }],
      });

      // Touch end at 180px (moved right by 80px > 40px threshold)
      fireEvent.touchEnd(container, {
        changedTouches: [{ clientX: 180 }],
      });

      // From 0 should loop to last slide (index 2)
      expect(screen.getByTestId('rpi-gallery-main-img')).toHaveAttribute('src', mockImages[2].src);
    });

    it('ignores small touches below threshold', () => {
      render(<PhotoGallery images={mockImages} autoPlay={false} enableSwipe={true} />);

      const container = screen.getByTestId('rpi-gallery-container');

      fireEvent.touchStart(container, { touches: [{ clientX: 100 }] });
      fireEvent.touchEnd(container, { changedTouches: [{ clientX: 120 }] }); // diff = 20 < 40

      expect(screen.getByTestId('rpi-gallery-main-img')).toHaveAttribute('src', mockImages[0].src);
    });
  });

  describe('Callback onSlideChange', () => {
    it('fires onSlideChange with correct index and item on navigation', () => {
      const onSlideChange = vi.fn();
      render(<PhotoGallery images={mockImages} autoPlay={false} onSlideChange={onSlideChange} />);

      fireEvent.click(screen.getByTestId('rpi-next-button'));

      expect(onSlideChange).toHaveBeenCalledTimes(1);
      expect(onSlideChange).toHaveBeenCalledWith(1, mockImages[1]);
    });
  });

  describe('Legacy PI_Gallery Compatibility', () => {
    it('renders and functions properly with legacy pi_gallery prop structure', () => {
      const legacyProps = {
        width: '500px',
        height: '300px',
        timer: 4000,
        pi_list: mockImages,
      };

      render(<PI_Gallery pi_gallery={legacyProps} />);

      expect(screen.getByTestId('rpi-gallery-main-img')).toHaveAttribute('src', mockImages[0].src);
      expect(screen.getByTestId('rpi-gallery-title')).toHaveTextContent(mockImages[0].title!);

      // Next button works
      fireEvent.click(screen.getByTestId('rpi-next-button'));
      expect(screen.getByTestId('rpi-gallery-main-img')).toHaveAttribute('src', mockImages[1].src);
    });
  });
});
