import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';

const galleryFile = path.resolve('src/data/gallery.ts');
const content = fs.readFileSync(galleryFile, 'utf8');
const match = content.match(/export const galleryItems:\s*GalleryItem\[\]\s*=\s*(\[[\s\S]*\]);/);
if (!match) {
  throw new Error('Could not parse galleryItems from src/data/gallery.ts');
}

const items = JSON.parse(match[1]);
const widths = [640, 1280];

let generatedCount = 0;

for (const item of items) {
  const relPath = item.src.replace(/^\/+/, '');
  const inputPath = path.resolve('public', relPath);
  if (!fs.existsSync(inputPath)) {
    throw new Error(`Missing source image: ${inputPath}`);
  }

  const parsed = path.parse(relPath);
  const subDir = parsed.dir.replace(/^img[\\/]?/, '');
  const outDir = path.resolve('public', 'thumbs', subDir);
  fs.mkdirSync(outDir, { recursive: true });

  for (const w of widths) {
    const outFile = path.join(outDir, `${parsed.name}-${w}w.webp`);
    const vf = `scale='min(${w},iw)':-2:flags=lanczos+accurate_rnd+full_chroma_int,unsharp=3:3:0.4:3:3:0.0`;
    execFileSync('ffmpeg', [
      '-y',
      '-v', 'error',
      '-i', inputPath,
      '-vf', vf,
      '-c:v', 'libwebp',
      '-q:v', '95',
      '-compression_level', '6',
      outFile,
    ]);
    generatedCount++;
  }

  const posixSubDir = subDir.replace(/\\/g, '/');
  item.thumb = `/thumbs/${posixSubDir}/${parsed.name}-1280w.webp`;
  item.thumbSrcSet = `/thumbs/${posixSubDir}/${parsed.name}-640w.webp 640w, /thumbs/${posixSubDir}/${parsed.name}-1280w.webp 1280w`;
}

const updatedTs = `export interface GalleryItem {
  src: string;
  thumb: string;
  thumbSrcSet: string;
  tag: string;
  airline: string;
  subtitle?: string;
}

export const galleryItems: GalleryItem[] = ${JSON.stringify(items, null, 2)};
`;

fs.writeFileSync(galleryFile, updatedTs, 'utf8');
console.log(`Done! Processed ${items.length} gallery items (${generatedCount} crisp q95 thumbnails generated).`);
