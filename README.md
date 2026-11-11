# eun0115.github.io

Personal planespotting journal and gallery built with Next.js (App Router).

## Adding New Pictures

`scripts/generate-thumbs.mjs` makes adding new pictures automatic and never leaves large raw files behind. Here is the 3-step workflow:

### 1. Drop your raw photo into `public/thumbs/`

Place your `.png` or `.jpg` inside the matching country/airline folder:

```text
public/thumbs/<Country>/<Airline>/<Registration>.png
```

*(For example: `public/thumbs/Philippines/Philippine Airlines/RP-C3512.png`)*

### 2. Add the entry in `src/data/gallery.ts`

Add an object to `galleryItems` in `src/data/gallery.ts` (you can write either `.png`/`.jpg` or `-1280w.webp` in `thumb`—the script normalizes it to `-1280w.webp` automatically):

```ts
  {
    "tag": "RP-C3512 | Airbus A350-1000",
    "airline": "Philippine Airlines",
    "subtitle": "Optional Livery / Sticker",
    "thumb": "/thumbs/Philippines/Philippine Airlines/RP-C3512-1280w.webp"
  },
```

### 3. Run the thumbnail generator

In your terminal, run:

```bash
npm run thumbs
```

That command will automatically:

1. Convert your new `.png`/`.jpg` into a sharp `-1280w.webp` thumbnail,
2. Delete the heavy original `.png`/`.jpg` so it doesn't eat storage, and
3. Normalize `thumb` to `-1280w.webp` in `src/data/gallery.ts`.
