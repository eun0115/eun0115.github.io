import type { Metadata } from 'next';
import Topbar from '@/components/Topbar';
import Footer from '@/components/Footer';
import { galleryItems } from '@/data/gallery';

export const metadata: Metadata = {
  title: 'eun0115 | Spotting Gallery',
};

export default function GalleryPage() {
  return (
    <div className="page-gallery">
      <Topbar />

      <main className="wrap">
        <section className="gallery-grid">
          {galleryItems.map((item, index) => (
            <article className="card" key={item.thumb}>
              <img
                src={item.thumb}
                srcSet={item.thumbSrcSet}
                sizes="(max-width: 700px) min(calc(100vw - 20px), 520px), (max-width: 1200px) 33vw, 340px"
                alt={`${item.airline} - ${item.tag}`}
                loading={index < 8 ? 'eager' : 'lazy'}
                decoding="async"
              />
              <div className="card-body">
                <span className="card-tag">{item.tag}</span>
                <div className="card-header card-header-stack">
                  <h2 tabIndex={0}>{item.airline}</h2>
                  {item.subtitle && (
                    <h4 className="card-subtitle">{item.subtitle}</h4>
                  )}
                </div>
              </div>
            </article>
          ))}
        </section>
      </main>

      <Footer />
    </div>
  );
}
