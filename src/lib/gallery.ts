import type { GalleryItem } from '@/data/gallery';

export const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export interface LetterGroup {
  letter: string;
  airlineCount: number;
  items: { item: GalleryItem; globalIndex: number }[];
}

/** Extract normalized airline name from a gallery item. */
export function getAirlineName(item: GalleryItem): string {
  return item.airline.trim();
}

/** Extract normalized aircraft model from a gallery item's tag. */
export function getAircraftName(item: GalleryItem): string {
  return (item.tag.split('|')[1] || item.tag).trim();
}

/** Group gallery items under A-Z headings by airline and sort alphabetically within each group. */
export function groupByAirlineLetter(items: GalleryItem[]): LetterGroup[] {
  const buckets = new Map<string, GalleryItem[]>();

  for (const item of items) {
    const firstChar = getAirlineName(item).charAt(0).toUpperCase();
    const letter = /^[A-Z]$/.test(firstChar) ? firstChar : '#';
    const existing = buckets.get(letter);
    if (existing) {
      existing.push(item);
    } else {
      buckets.set(letter, [item]);
    }
  }

  const sortedLetters = Array.from(buckets.keys()).sort((a, b) => {
    if (a === '#') return 1;
    if (b === '#') return -1;
    return a.localeCompare(b, 'en');
  });

  let runningIndex = 0;

  return sortedLetters.map((letter) => {
    const sortedItems = [...(buckets.get(letter) ?? [])].sort((a, b) =>
      getAirlineName(a).localeCompare(getAirlineName(b), 'en', {
        sensitivity: 'base',
      })
    );

    const airlineCount = new Set(
      sortedItems.map((entry) => getAirlineName(entry).toLowerCase())
    ).size;

    const indexedItems = sortedItems.map((item) => ({
      item,
      globalIndex: runningIndex++,
    }));

    return {
      letter,
      airlineCount,
      items: indexedItems,
    };
  });
}
