import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { chromium } from 'playwright';
import { exec } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, '../dist');

const routes = [
  '/',
  '/work',
  '/pricing',
  '/about',
  '/process',
  '/contact',
  '/start-a-project'
];

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function startServer() {
  const child = exec('npm run preview');
  await sleep(3000); // Wait for server to start
  return child;
}

async function prerender() {
  console.log('Starting prerender...');
  const serverProcess = await startServer();
  
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  const port = 4173; // Default vite preview port

  for (const route of routes) {
    const url = `http://localhost:${port}${route}`;
    console.log(`Prerendering ${url}...`);
    
    await page.goto(url, { waitUntil: 'networkidle' });
    
    // Wait for a brief moment to ensure animations/effects settle if any
    await sleep(1000);
    
    const html = await page.content();
    
    let filePath;
    if (route === '/') {
      filePath = path.join(distDir, 'index.html');
    } else {
      const routeDir = path.join(distDir, route.substring(1));
      await fs.mkdir(routeDir, { recursive: true });
      filePath = path.join(routeDir, 'index.html');
    }
    
    await fs.writeFile(filePath, html);
    console.log(`Saved ${route} to ${filePath}`);
  }
  
  await browser.close();
  serverProcess.kill();
  console.log('Prerender complete.');
}

prerender().catch(console.error);
