'use client';

import { useState, useMemo } from 'react';
import type { GalleryItem } from '@/data/gallery';
import { getAircraftName, getAirlineName } from '@/lib/gallery';

interface GalleryStatsProps {
  items: GalleryItem[];
}

export default function GalleryStats({ items }: GalleryStatsProps) {
  const [activeTab, setActiveTab] = useState<'none' | 'airlines' | 'aircrafts'>('none');

  const { airlineRanks, aircraftRanks } = useMemo(() => {
    const airlineMap = new Map<string, number>();
    const aircraftMap = new Map<string, number>();

    for (const item of items) {
      const airline = getAirlineName(item);
      airlineMap.set(airline, (airlineMap.get(airline) || 0) + 1);

      const aircraft = getAircraftName(item);
      aircraftMap.set(aircraft, (aircraftMap.get(aircraft) || 0) + 1);
    }

    const airlineRanks = Array.from(airlineMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));

    const aircraftRanks = Array.from(aircraftMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));

    return { airlineRanks, aircraftRanks };
  }, [items]);

  const totalPictures = items.length;
  const totalAirlines = airlineRanks.length;
  const totalAircrafts = aircraftRanks.length;

  const toggleTab = (tab: 'airlines' | 'aircrafts') => {
    setActiveTab((prev) => (prev === tab ? 'none' : tab));
  };

  const activeList = activeTab === 'airlines' ? airlineRanks : aircraftRanks;
  const maxCount = activeList[0]?.count || 1;

  return (
    <div className="gallery-stats-wrapper" aria-label="Gallery statistics and rankings">
      <div className="gallery-stats">
        <div className="stat-item stat-pictures">
          <span className="stat-dot" aria-hidden="true" />
          <span>
            <strong>{totalPictures}</strong> pictures and counting
          </span>
        </div>

        <button
          type="button"
          className={`stat-item stat-airlines stat-interactive ${
            activeTab === 'airlines' ? 'is-active' : ''
          }`}
          onClick={() => toggleTab('airlines')}
          aria-expanded={activeTab === 'airlines'}
        >
          <span className="stat-dot" aria-hidden="true" />
          <span>
            <strong>{totalAirlines}</strong> airlines and counting
          </span>
          <span className="stat-ToggleIcon" aria-hidden="true">
            {activeTab === 'airlines' ? '▴' : '▾'}
          </span>
        </button>

        <button
          type="button"
          className={`stat-item stat-aircrafts stat-interactive ${
            activeTab === 'aircrafts' ? 'is-active' : ''
          }`}
          onClick={() => toggleTab('aircrafts')}
          aria-expanded={activeTab === 'aircrafts'}
        >
          <span className="stat-dot" aria-hidden="true" />
          <span>
            <strong>{totalAircrafts}</strong> aircrafts and counting
          </span>
          <span className="stat-ToggleIcon" aria-hidden="true">
            {activeTab === 'aircrafts' ? '▴' : '▾'}
          </span>
        </button>
      </div>

      {activeTab !== 'none' && (
        <div className={`rankings-panel rankings-${activeTab}`}>
          <div className="rankings-header">
            <span className="rankings-title">
              {activeTab === 'airlines'
                ? 'Airlines Ranked by Photos Spotted'
                : 'Aircraft Ranked by Photos Spotted'}
            </span>
            <button
              type="button"
              className="rankings-close"
              onClick={() => setActiveTab('none')}
            >
              Close ✕
            </button>
          </div>
          <ol className="rankings-grid">
            {activeList.map((entry, idx) => {
              const rank = idx + 1;
              const pct = Math.round((entry.count / maxCount) * 100);
              return (
                <li
                  key={entry.name}
                  className="rank-card"
                >
                  <div className="rank-card-top">
                    <span className="rank-number">#{rank}</span>
                    <span className="rank-name">{entry.name}</span>
                    <span className="rank-count">{entry.count}</span>
                  </div>
                  <div className="rank-bar-track" aria-hidden="true">
                    <div
                      className="rank-bar-fill"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      )}
    </div>
  );
}
