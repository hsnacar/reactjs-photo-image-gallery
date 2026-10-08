import React, { useState } from 'react';
import { PhotoGallery, PI_Gallery, GalleryItem } from '../src/index';

const modernImages: GalleryItem[] = [
  {
    src: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    title: 'Yosemite Valley Landscape',
    alt: 'Yosemite National Park',
    url: 'https://unsplash.com',
    target: '_blank',
  },
  {
    src: 'https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=1200&q=80',
    title: 'Misty Alpine Woods',
    alt: 'Forest mist',
  },
  {
    src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    title: 'Tropical Beach Paradise',
    alt: 'Seaside sunset',
  },
  {
    src: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80',
    title: 'Autumn Mountain Fog',
    alt: 'Mountain Fog',
  },
];

const legacyData = {
  width: '500px',
  height: '300px',
  timer: 3000,
  pi_list: [
    {
      src: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80',
      alt: 'Mountain Fog',
      url_enable: true,
      url: 'https://unsplash.com',
      target: '_blank',
      title: 'Legacy: Mountain Fog',
    },
    {
      src: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=1200&q=80',
      alt: 'Autumn Forest',
      url_enable: false,
      title: 'Legacy: Autumn Forest',
    },
  ],
};

export default function App() {
  const [currentSlideInfo, setCurrentSlideInfo] = useState<string>('0: Yosemite Valley Landscape');

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 20px' }}>
      <header style={{ marginBottom: '32px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '28px', margin: '0 0 8px 0' }}>
          reactjs-photo-image-gallery <span style={{ color: '#38bdf8' }}>v2.0.0</span>
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '15px', margin: 0 }}>
          Interactive Test Playground &middot; Modern API &amp; Navigation Controls
        </p>
      </header>

      {/* Demo 1: Arrows & Thumbnail Strip */}
      <section style={{ backgroundColor: '#1e293b', padding: '24px', borderRadius: '12px', marginBottom: '32px' }}>
        <h2 style={{ fontSize: '18px', margin: '0 0 12px 0', color: '#e2e8f0' }}>
          1. Ok Butonları + Thumbnail İndikatörleri (<code style={{ color: '#38bdf8' }}>showArrows + showThumbnails</code>)
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '13px', margin: '0 0 16px 0' }}>
          Önceki/Sonraki butonları, alt kısımda tıklanabilir küçük resim şeridi, klavye ok tuşları ve dokunmatik swipe desteği.
        </p>
        
        <PhotoGallery
          images={modernImages}
          interval={4000}
          width="100%"
          height="400px"
          showArrows={true}
          showThumbnails={true}
          thumbnailHeight={65}
          pauseOnHover={true}
          theme="dark"
          onSlideChange={(index, item) => setCurrentSlideInfo(`${index}: ${item.title}`)}
        />
        
        <div style={{ marginTop: '12px', fontSize: '13px', color: '#64748b' }}>
          Aktif Slayt: <span style={{ color: '#38bdf8' }}>{currentSlideInfo}</span>
        </div>
      </section>

      {/* Demo 2: Arrows & Dot Pagination */}
      <section style={{ backgroundColor: '#1e293b', padding: '24px', borderRadius: '12px', marginBottom: '32px' }}>
        <h2 style={{ fontSize: '18px', margin: '0 0 12px 0', color: '#e2e8f0' }}>
          2. Ok Butonları + Nokta İndikatörleri (<code style={{ color: '#38bdf8' }}>showArrows + showIndicators</code>)
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '13px', margin: '0 0 16px 0' }}>
          Kompakt görünüm: Tıklanabilir alt noktalar (dot indicators) ve navigasyon okları.
        </p>
        
        <PhotoGallery
          images={modernImages}
          interval={3500}
          width="100%"
          height="320px"
          showArrows={true}
          showIndicators={true}
          showThumbnails={false}
          pauseOnHover={true}
          theme="dark"
        />
      </section>

      {/* Demo 3: Legacy Backward Compatibility */}
      <section style={{ backgroundColor: '#1e293b', padding: '24px', borderRadius: '12px' }}>
        <h2 style={{ fontSize: '18px', margin: '0 0 12px 0', color: '#e2e8f0' }}>
          3. Geriye Dönük Uyumluluk (<code style={{ color: '#f59e0b' }}>&lt;PI_Gallery pi_gallery=&#123;...&#125; /&gt;</code>)
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '13px', margin: '0 0 16px 0' }}>
          Eski v1 API yapısı otomatik olarak ok ve nokta butonlarıyla çalışır:
        </p>
        
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <PI_Gallery pi_gallery={legacyData} />
        </div>
      </section>
    </div>
  );
}
