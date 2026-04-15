import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, '../dist');

const routes = [
  '/',
  '/work',
  '/pricing',
  '/about',
  '/process',
  '/start-a-project'
];

async function seedRouteShells() {
  const sourceHtml = await fs.readFile(path.join(distDir, 'index.html'), 'utf8');

  for (const route of routes) {
    if (route === '/') {
      continue;
    }

    const routeDir = path.join(distDir, route.substring(1));
    await fs.mkdir(routeDir, { recursive: true });
    await fs.writeFile(path.join(routeDir, 'index.html'), sourceHtml);
    console.log(`Seeded ${route} to ${path.join(routeDir, 'index.html')}`);
  }
}

async function prerender() {
  console.log('Seeding route shells...');
  await seedRouteShells();
  console.log('Route shell seeding complete.');
}

prerender().catch(console.error);
