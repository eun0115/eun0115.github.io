'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Topbar() {
  const pathname = usePathname() || '/';
  const isGallery =
    pathname === '/gallery' ||
    pathname === '/gallery.html' ||
    pathname === '/gallery/';
  const isContact =
    pathname === '/contact' ||
    pathname === '/contact.html' ||
    pathname === '/contact/';

  useEffect(() => {
    const syncNavState = () => {
      const isCompact = document.body.classList.contains('scrolled');
      const collapseDistance = window.innerWidth <= 700 ? 16 : 40;
      const canCompact =
        document.documentElement.scrollHeight - window.innerHeight >
        collapseDistance + 8;
      const shouldCompact = isCompact
        ? window.scrollY >= 8
        : window.scrollY > 40 && canCompact;

      if (shouldCompact !== isCompact) {
        document.body.classList.toggle('scrolled', shouldCompact);
      }
    };

    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          syncNavState();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    syncNavState();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [pathname]);

  return (
    <header className="topbar">
      <div className="wrap">
        <Link className="wordmark" href="/" aria-label="Home">
          <img src="/assets/logo.svg" alt="Logo" />
        </Link>
        <nav aria-label="Main navigation">
          <Link
            href="/gallery"
            aria-current={isGallery ? 'page' : undefined}
          >
            Gallery
          </Link>
          <Link
            href="/contact"
            aria-current={isContact ? 'page' : undefined}
          >
            About
          </Link>
        </nav>
      </div>
    </header>
  );
}
