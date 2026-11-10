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
          <h1 id="contact-title">A planespotter&apos;s view.</h1>
          <p className="contact-copy">
            I’m Gian Paolo, also known as “eun0115.” I’m a planespotter, 
            Linux enthusiast, and student pilot. I enjoy exploring 
            technology, aviation, and the freedom to understand, 
            modify, and repair the things we use. 
          </p>
          <a className="email-link" href="mailto:gpestacio5@gail.com">
            Get in touch <span aria-hidden="true">↗</span>
          </a>
        </section>
      </main>
    </div>
  );
}
