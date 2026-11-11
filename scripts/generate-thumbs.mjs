import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';

const thumbsRoot = path.resolve('public', 'thumbs');

// Recursively scan public/thumbs:
// - Remove any legacy -640w.webp files
// - Convert any raw .png / .jpg / .jpeg files to sharp -1280w.webp and remove the raw original
function processThumbsDir(dir) {
  if (!fs.existsSync(dir)) return { converted: 0, removed640: 0 };
  let converted = 0;
  let removed640 = 0;

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      const sub = processThumbsDir(fullPath);
      converted += sub.converted;
      removed640 += sub.removed640;
    } else if (/-640w\.webp$/i.test(entry.name)) {
      fs.unlinkSync(fullPath);
      removed640++;
    } else if (/\.(png|jpe?g)$/i.test(entry.name)) {
      const parsed = path.parse(fullPath);
      const baseName = parsed.name.replace(/-1280w$/i, '');
      const outFile = path.join(parsed.dir, `${baseName}-1280w.webp`);
      const vf = `scale='min(1280,iw)':-2:flags=lanczos+accurate_rnd+full_chroma_int,unsharp=3:3:0.4:3:3:0.0`;
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
      fs.unlinkSync(fullPath);
      console.log(`Converted & removed raw image: ${path.relative(thumbsRoot, fullPath)}`);
      converted++;
    }
  }
  return { converted, removed640 };
}

const { converted, removed640 } = processThumbsDir(thumbsRoot);

// Normalize entries in src/data/gallery.ts to use -1280w.webp
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
    };
  });

  const updatedTs = `export interface GalleryItem {
  thumb: string;
  tag: string;
  airline: string;
  subtitle?: string;
}

export const galleryItems: GalleryItem[] = ${JSON.stringify(items, null, 2)};
`;
  fs.writeFileSync(galleryFile, updatedTs, 'utf8');
  console.log(
    `Done! Converted ${converted} new raw image(s), removed ${removed640} legacy -640w file(s), and synced ${items.length} gallery entries to -1280w.webp.`
  );
}
