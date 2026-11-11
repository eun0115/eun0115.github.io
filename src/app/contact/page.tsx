import type { Metadata } from 'next';
import Topbar from '@/components/Topbar';
import Footer from '@/components/Footer';
import VisitorCounter from '@/components/VisitorCounter';

export const metadata: Metadata = {
  title: 'eun0115 | About',
};

export default function ContactPage() {
  return (
    <div className="page-contact">
      <Topbar />

      <main id="contact" className="wrap">
        <section className="hero" aria-labelledby="contact-title">
          <div>
            <h1 id="contact-title">A planespotter&apos;s view.</h1>
            <p className="intro">
              I&apos;m Gian Paolo, also known as &ldquo;eun0115&rdquo; — a
              planespotter, student pilot, and tech enthusiast based in Manila,
              Philippines. This site is my personal corner of the web and keep
              track of the things i captured along the way.
            </p>
            <div className="contact-meta">
              <a className="email-link" href="mailto:gpestacio5@gmail.com">
                Get in touch <span aria-hidden="true">↗</span>
              </a>
              <VisitorCounter />
            </div>
          </div>
          <div className="portrait">
            <img src="/assets/eun.jpg" alt="Gian Paolo (eun0115)" />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
