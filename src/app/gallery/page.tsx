import type { Metadata } from 'next';
import Topbar from '@/components/Topbar';
import Footer from '@/components/Footer';
import GalleryStats from '@/components/GalleryStats';
import GalleryBrowser from '@/components/GalleryBrowser';
import { galleryItems } from '@/data/gallery';

export const metadata: Metadata = {
  title: 'eun0115 | Spotting Gallery',
};

export default function GalleryPage() {
  return (
    <div className="page-gallery">
      <Topbar />

      <main className="wrap">
        <GalleryStats items={galleryItems} />
        <GalleryBrowser items={galleryItems} />
      </main>

      <Footer />
    </div>
  );
}
