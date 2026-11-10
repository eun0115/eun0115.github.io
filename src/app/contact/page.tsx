import type { Metadata } from 'next';
import Topbar from '@/components/Topbar';

export const metadata: Metadata = {
  title: 'eun0115 | About',
};

export default function ContactPage() {
  return (
    <div className="page-contact">
      <Topbar />

      <main className="wrap">
        <section className="contact-content" aria-labelledby="contact-title">
          <h1 id="contact-title">A plane spotter&apos;s view.</h1>
          <p className="contact-copy">
            I’m Gian Paolo, a student pilot flying the PA-38-112. I also enjoy
            plane spotting and photographing the aircraft I come across with my
            Nikon D3100, using an AF-S DX VR 55–200mm f/4–5.6G IF-ED or AF-S DX
            35mm f/1.8G lens. This is where I share some of those photos.
          </p>
          <a className="email-link" href="mailto:gpestacio5@gail.com">
            Get in touch <span aria-hidden="true">↗</span>
          </a>
        </section>
      </main>
    </div>
  );
}
