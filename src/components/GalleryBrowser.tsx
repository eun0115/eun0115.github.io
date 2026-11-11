'use client';

import { useMemo, useState } from 'react';
import type { GalleryItem } from '@/data/gallery';
import {
  ALPHABET,
  getAircraftName,
  getAirlineName,
  groupByAirlineLetter,
} from '@/lib/gallery';

interface GalleryBrowserProps {
  items: GalleryItem[];
}

export default function GalleryBrowser({ items }: GalleryBrowserProps) {
  const [selectedAirline, setSelectedAirline] = useState('');
  const [selectedAircraft, setSelectedAircraft] = useState('');

  const airlineOptions = useMemo(() => {
    const all = new Set<string>();
    const counts = new Map<string, number>();

    for (const item of items) {
      const airline = getAirlineName(item);
      all.add(airline);
      if (!selectedAircraft || getAircraftName(item) === selectedAircraft) {
        counts.set(airline, (counts.get(airline) || 0) + 1);
      }
    }

    return Array.from(all)
      .sort((a, b) => a.localeCompare(b, 'en', { sensitivity: 'base' }))
      .map((name) => ({ name, count: counts.get(name) || 0 }));
  }, [items, selectedAircraft]);

  const aircraftOptions = useMemo(() => {
    const all = new Set<string>();
    const counts = new Map<string, number>();

    for (const item of items) {
      const aircraft = getAircraftName(item);
      all.add(aircraft);
      if (!selectedAirline || getAirlineName(item) === selectedAirline) {
        counts.set(aircraft, (counts.get(aircraft) || 0) + 1);
      }
    }

    return Array.from(all)
      .sort((a, b) => a.localeCompare(b, 'en', { sensitivity: 'base' }))
      .map((name) => ({ name, count: counts.get(name) || 0 }));
  }, [items, selectedAirline]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (selectedAirline && getAirlineName(item) !== selectedAirline) {
        return false;
      }
      if (selectedAircraft && getAircraftName(item) !== selectedAircraft) {
        return false;
      }
      return true;
    });
  }, [items, selectedAirline, selectedAircraft]);

  const groups = useMemo(
    () => groupByAirlineLetter(filteredItems),
    [filteredItems]
  );

  const availableLetters = useMemo(
    () => new Set(groups.map((g) => g.letter)),
    [groups]
  );

  const navLetters = availableLetters.has('#') ? [...ALPHABET, '#'] : ALPHABET;
  const isFiltered = Boolean(selectedAirline || selectedAircraft);

  const handleReset = () => {
    setSelectedAirline('');
    setSelectedAircraft('');
  };

  return (
    <>
      <div className="gallery-filters" role="region" aria-label="Filter gallery">
        <div className="filter-controls">
          <div className="filter-group">
            <label htmlFor="filter-airline" className="filter-label">
              Airline
            </label>
            <select
              id="filter-airline"
              className="filter-select"
              value={selectedAirline}
              onChange={(e) => setSelectedAirline(e.target.value)}
            >
              <option value="">All airlines</option>
              {airlineOptions.map((opt) => (
                <option
                  key={opt.name}
                  value={opt.name}
                  disabled={opt.count === 0 && opt.name !== selectedAirline}
                >
                  {`${opt.name} (${opt.count})`}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="filter-aircraft" className="filter-label">
              Aircraft
            </label>
            <select
              id="filter-aircraft"
              className="filter-select"
              value={selectedAircraft}
              onChange={(e) => setSelectedAircraft(e.target.value)}
            >
              <option value="">All aircraft</option>
              {aircraftOptions.map((opt) => (
                <option
                  key={opt.name}
                  value={opt.name}
                  disabled={opt.count === 0 && opt.name !== selectedAircraft}
                >
                  {`${opt.name} (${opt.count})`}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="filter-meta">
          <span className="filter-count" aria-live="polite">
            {isFiltered
              ? `Showing ${filteredItems.length} of ${items.length} photos`
              : `Showing all ${items.length} photos`}
          </span>
          {isFiltered && (
            <button
              type="button"
              className="filter-reset"
              onClick={handleReset}
            >
              Reset
            </button>
          )}
        </div>
      </div>

      <nav className="alpha-nav" aria-label="Jump to airline letter">
        {navLetters.map((letter) =>
          availableLetters.has(letter) ? (
            <a
              key={letter}
              href={`#letter-${letter}`}
              className="alpha-link"
            >
              {letter}
            </a>
          ) : (
            <span
              key={letter}
              className="alpha-link is-empty"
              aria-disabled="true"
            >
              {letter}
            </span>
          )
        )}
      </nav>

      {groups.length > 0 ? (
        <div className="gallery-sections">
          {groups.map((group) => (
            <section
              key={group.letter}
              id={`letter-${group.letter}`}
              className="letter-section"
              aria-labelledby={`heading-${group.letter}`}
            >
              <div className="letter-heading">
                <h2 id={`heading-${group.letter}`} className="letter-title">
                  {group.letter}
                </h2>
                <span className="letter-meta">
                  {`${group.items.length} ${group.items.length === 1 ? 'photo' : 'photos'} · ${group.airlineCount} ${group.airlineCount === 1 ? 'airline' : 'airlines'}`}
                </span>
              </div>

              <div className="gallery-grid">
                {group.items.map(({ item, globalIndex }) => (
                  <article className="card" key={item.thumb}>
                    <img
                      src={item.thumb}
                      alt={`${item.airline} - ${item.tag}`}
                      loading={globalIndex < 8 ? 'eager' : 'lazy'}
                      decoding="async"
                    />
                    <div className="card-body">
                      <span className="card-tag">{item.tag}</span>
                      <div className="card-header card-header-stack">
                        <h3 tabIndex={0}>{item.airline}</h3>
                        {item.subtitle && (
                          <h4 className="card-subtitle">{item.subtitle}</h4>
                        )}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className="filter-empty">
          <p>No photos match the selected airline and aircraft combination.</p>
          <button
            type="button"
            className="filter-reset"
            onClick={handleReset}
          >
            Reset filters
          </button>
        </div>
      )}
    </>
  );
}
