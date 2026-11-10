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
          {galleryItems.map((item) => (
            <article className="card" key={item.src}>
              <img
                src={item.src}
                alt={`${item.airline} - ${item.tag}`}
                loading="lazy"
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
