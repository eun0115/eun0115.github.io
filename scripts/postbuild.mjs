import fs from 'fs';
import path from 'path';

const outDir = path.resolve('out');

if (fs.existsSync(outDir)) {
  // Ensure .nojekyll exists so GitHub Pages serves _next/ static assets
  fs.writeFileSync(path.join(outDir, '.nojekyll'), '');

  // Ensure both /route.html and /route/index.html exist for all subroutes
  for (const route of ['gallery', 'contact']) {
    const htmlFile = path.join(outDir, `${route}.html`);
    const routeDir = path.join(outDir, route);
    const indexHtml = path.join(routeDir, 'index.html');

    if (fs.existsSync(htmlFile)) {
      fs.mkdirSync(routeDir, { recursive: true });
      fs.copyFileSync(htmlFile, indexHtml);
    }
  }
  console.log('Postbuild completed: verified .nojekyll and route fallbacks in out/');
}
