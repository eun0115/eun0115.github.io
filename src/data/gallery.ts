import { airliners } from './airliners';
import { military } from './military';
import { generalAviation } from './general-aviation';

export interface GalleryItem {
  thumb: string;
  tag: string;
  airline: string;
  subtitle?: string;
}

export const galleryItems: GalleryItem[] = [
  ...airliners,
  ...military,
  ...generalAviation,
];
