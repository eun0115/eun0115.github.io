'use client';

import { useEffect, useState } from 'react';

export default function VisitorCounter() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    let isMounted = true;
    const sessionKey = 'eun0115_visit_counted';
    const cacheKey = 'eun0115_visit_last_count';

    const updateCounter = async () => {
      try {
        const alreadyCounted = sessionStorage.getItem(sessionKey);
        const endpoint = alreadyCounted
          ? 'https://api.counterapi.dev/v1/eun0115.github.io/visits/'
          : 'https://api.counterapi.dev/v1/eun0115.github.io/visits/up';

        const res = await fetch(endpoint);
        if (!res.ok) throw new Error('Counter request failed');
        const data = await res.json();

        if (typeof data?.count === 'number') {
          sessionStorage.setItem(sessionKey, '1');
          localStorage.setItem(cacheKey, String(data.count));
          if (isMounted) setCount(data.count);
          return;
        }
      } catch {
        // Fallback to cached count if offline or blocked by content blocker
        const cached = Number(localStorage.getItem(cacheKey) || '1');
        if (isMounted) setCount(cached);
      }
    };

    updateCounter();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="visitor-counter" aria-live="polite">
      <span className="visitor-dot" aria-hidden="true" />
      <span className="visitor-label">Visitors</span>
      <span className="visitor-value">
        {count !== null ? count.toLocaleString() : '—'}
      </span>
    </div>
  );
}
