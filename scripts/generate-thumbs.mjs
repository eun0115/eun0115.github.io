import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';

const widths = [640, 1280];
const thumbsRoot = path.resolve('public', 'thumbs');

// Recursively scan public/thumbs for any raw .png / .jpg / .jpeg files,
// convert them to -640w.webp and -1280w.webp, and remove the heavy original.
function convertRawImages(dir) {
  if (!fs.existsSync(dir)) return 0;
  let count = 0;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      count += convertRawImages(fullPath);
    } else if (/\.(png|jpe?g)$/i.test(entry.name)) {
      const parsed = path.parse(fullPath);
      for (const w of widths) {
        const outFile = path.join(parsed.dir, `${parsed.name}-${w}w.webp`);
        const vf = `scale='min(${w},iw)':-2:flags=lanczos+accurate_rnd+full_chroma_int,unsharp=3:3:0.4:3:3:0.0`;
        execFileSync('ffmpeg', [
          '-y',
          '-v', 'error',
          '-i', fullPath,
          '-vf', vf,
          '-c:v', 'libwebp',
          '-q:v', '95',
          '-compression_level', '6',
          outFile,
        ]);
      }
      fs.unlinkSync(fullPath);
      console.log(`Converted & removed raw image: ${path.relative(thumbsRoot, fullPath)}`);
      count++;
    }
  }
  return count;
}

const converted = convertRawImages(thumbsRoot);

// Also normalize any entries in src/data/gallery.ts so you only need to write `thumb`
const galleryFile = path.resolve('src/data/gallery.ts');
const content = fs.readFileSync(galleryFile, 'utf8');
const match = content.match(/export const galleryItems:\s*GalleryItem\[\]\s*=\s*(\[[\s\S]*\]);/);
if (match) {
  const items = JSON.parse(match[1]).map((item) => {
    const rawThumb = (item.thumb || item.src || '')
      .replace(/\\/g, '/')
      .replace(/^\/?(img|thumbs)\//, '/thumbs/')
      .replace(/(-640w|-1280w)?\.(png|jpe?g|webp)$/i, '');
    return {
      tag: item.tag,
      airline: item.airline,
      ...(item.subtitle ? { subtitle: item.subtitle } : {}),
      thumb: `${rawThumb}-1280w.webp`,
      thumbSrcSet: `${rawThumb}-640w.webp 640w, ${rawThumb}-1280w.webp 1280w`,
    };
  });

  const updatedTs = `export interface GalleryItem {
  thumb: string;
  thumbSrcSet: string;
  tag: string;
  airline: string;
  subtitle?: string;
}

export const galleryItems: GalleryItem[] = ${JSON.stringify(items, null, 2)};
`;
  fs.writeFileSync(galleryFile, updatedTs, 'utf8');
  console.log(`Done! Converted ${converted} new raw image(s) and synced ${items.length} gallery entries.`);
}
