import Topbar from '@/components/Topbar';
import Footer from '@/components/Footer';

export default function HomePage() {
  return (
    <div className="page-home">
      <Topbar />

      <main id="home" className="wrap">
        <section className="hero" id="about" aria-labelledby="intro-title">
          <div>
            <p className="eyebrow">A plane spotter&apos;s journal</p>
            <h1 id="intro-title">
              Every arrival has <em>a story.</em>
            </h1>
            <p className="intro">
              What started as a curiosity about aircraft grew into a passion for
              planespotting and photography. Here, I document the aircraft
              I&apos;ve encountered, the places I&apos;ve visited, and the
              moments I&apos;ve captured along the way.
            </p>
          </div>
          <div className="portrait">
            <img src="/assets/ceb.jpg" alt="Cebu Pacific aircraft" />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
