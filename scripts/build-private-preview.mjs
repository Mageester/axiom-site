// Builds a PIN-protected private preview of a client mockup, for example a homepage concept we send a prospect.
//
// This repository is public, so the mockup itself is never committed. Only an encrypted copy is:
// - AES-GCM, with the key derived from the PIN by PBKDF2.
// - The page asks for the PIN and decrypts the mockup in the visitor's browser.
// - Without the PIN, the committed file is unreadable.
// A short PIN keeps out search engines and anyone who stumbles on the link. It is not bank-grade protection,
// so keep real secrets out of mockups.
//
// Google Fonts in the mockup are downloaded and self-hosted next to it, because the site's
// Content-Security-Policy only allows fonts from this origin.
//
// Usage (PowerShell):
//   $env:PREVIEW_PIN = '123456'
//   node scripts/build-private-preview.mjs --src C:\path\mockup.html --slug client-name --client "Client Name" --for "First name" --until 2026-12-31
// Output: public/preview/<slug>/index.html (+ fonts/). Remove that folder to take the preview down.

import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { randomBytes, webcrypto } from 'node:crypto';

const args = Object.fromEntries(process.argv.slice(2).reduce((pairs, value, i, all) => (value.startsWith('--') ? [...pairs, [value.slice(2), all[i + 1]]] : pairs), []));
const pin = process.env.PREVIEW_PIN || '';
for (const key of ['src', 'slug', 'client', 'for', 'until']) if (!args[key]) throw new Error(`Missing --${key}`);
if (!/^\d{6}$/.test(pin)) throw new Error('Set PREVIEW_PIN to a 6-digit PIN');
if (!/^[a-z0-9-]+$/.test(args.slug)) throw new Error('--slug may only use a-z, 0-9 and hyphens');
if (!/^\d{4}-\d{2}-\d{2}$/.test(args.until)) throw new Error('--until must be YYYY-MM-DD');

const outDir = join('public', 'preview', args.slug);
const fontDir = join(outDir, 'fonts');
const publicBase = `/preview/${args.slug}/fonts/`;
rmSync(outDir, { recursive: true, force: true });
mkdirSync(fontDir, { recursive: true });

const escapeHtml = (text) => String(text).replace(/[&<>"]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));
// A current desktop browser user agent makes Google Fonts answer with woff2 files.
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36';
let fontCount = 0;

// Download one Google Fonts stylesheet and return @font-face rules for its latin subset, pointing at self-hosted files.
async function selfHostFonts(cssUrl) {
  const css = await (await fetch(cssUrl, { headers: { 'User-Agent': UA } })).text();
  const blocks = css.split(/(?=\/\* [a-z-]+ \*\/)/).filter((block) => block.startsWith('/* latin */'));
  const rules = [];
  for (const block of blocks) {
    const match = block.match(/url\((https:\/\/fonts\.gstatic\.com\/[^)]+\.woff2)\)/);
    if (!match) continue;
    const family = (block.match(/font-family:\s*'([^']+)'/) || [])[1] || 'font';
    const weight = (block.match(/font-weight:\s*([\d ]+);/) || [])[1] || '400';
    const style = (block.match(/font-style:\s*(\w+)/) || [])[1] || 'normal';
    const file = `${family.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${weight.trim().replace(/\s+/g, '-')}-${style}.woff2`;
    const bytes = Buffer.from(await (await fetch(match[1], { headers: { 'User-Agent': UA } })).arrayBuffer());
    writeFileSync(join(fontDir, file), bytes);
    fontCount += 1;
    rules.push(block.replace(/\/\* latin \*\/\s*/, '').replace(match[1], publicBase + file).trim());
  }
  return rules.join('\n');
}

// 1. The mockup, with its Google Fonts swapped for self-hosted copies.
let mockup = readFileSync(args.src, 'utf8');
const fontLinks = [...mockup.matchAll(/<link[^>]+href="(https:\/\/fonts\.googleapis\.com\/css2?[^"]+)"[^>]*>/g)];
let fontCss = '';
for (const [, href] of fontLinks) fontCss += (await selfHostFonts(href.replace(/&amp;/g, '&'))) + '\n';
mockup = mockup
  .replace(/<link[^>]+href="https:\/\/fonts\.(googleapis|gstatic)\.com[^"]*"[^>]*>\s*/g, '')
  .replace(/<head>/i, `<head>\n<style>${fontCss}</style>`);
if (/\son[a-z]+\s*=\s*["']/i.test(mockup)) throw new Error('The mockup uses inline event handlers (onclick=...). The site CSP blocks them; use addEventListener.');
if (/https?:\/\/(?!getaxiom\.ca|www\.w3\.org)[a-z0-9.-]+\.[a-z]{2,}\/[^"'\s)]*\.(?:js|css|woff2?|png|jpe?g|webp|svg)/i.test(mockup)) console.warn('Warning: the mockup still loads files from another site; the CSP may block them.');

// 2. Encrypt it with a key derived from the PIN.
const ITERATIONS = 310000;
const salt = randomBytes(16);
const iv = randomBytes(12);
const material = await webcrypto.subtle.importKey('raw', new TextEncoder().encode(pin), 'PBKDF2', false, ['deriveKey']);
const key = await webcrypto.subtle.deriveKey({ name: 'PBKDF2', salt, iterations: ITERATIONS, hash: 'SHA-256' }, material, { name: 'AES-GCM', length: 256 }, false, ['encrypt']);
const sealed = Buffer.from(await webcrypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, new TextEncoder().encode(mockup)));
const payload = { v: 1, k: args.slug, u: args.until, n: ITERATIONS, s: salt.toString('base64'), i: iv.toString('base64'), d: sealed.toString('base64') };

// 3. The PIN page. Fonts: the site's own Instrument Sans and Instrument Serif, self-hosted here too.
const gateFonts = await selfHostFonts('https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;600&family=Instrument+Serif:ital@1&display=swap');
const untilText = new Date(`${args.until}T12:00:00`).toLocaleDateString('en-CA', { month: 'long', day: 'numeric', year: 'numeric' });
const page = `<!doctype html>
<html lang="en-CA">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="robots" content="noindex, nofollow">
<meta name="referrer" content="no-referrer">
<meta name="theme-color" content="#0b0b0c">
<title>Private preview · Axiom Web</title>
<link rel="icon" href="/favicon.png">
<style>
${gateFonts}
:root { --bg: #0b0b0c; --surface: #141415; --line: rgba(255,255,255,.09); --line-strong: rgba(255,255,255,.18); --ink: #f2f1ec; --text: #b6b5ae; --muted: #8f8e88; --accent: #8ea8ff; --error: #ffb4a8;
  --sans: 'Instrument Sans', system-ui, -apple-system, 'Segoe UI', sans-serif; --serif: 'Instrument Serif', Georgia, 'Times New Roman', serif; color-scheme: dark; }
* { box-sizing: border-box; }
html, body { margin: 0; min-height: 100%; background: var(--bg); color: var(--text); font: 400 16px/1.55 var(--sans); -webkit-font-smoothing: antialiased; }
body { display: grid; min-height: 100vh; min-height: 100dvh; padding: max(24px, env(safe-area-inset-top)) max(20px, env(safe-area-inset-right)) max(24px, env(safe-area-inset-bottom)) max(20px, env(safe-area-inset-left)); }
main { width: 100%; max-width: 440px; margin: auto; display: grid; gap: 28px; }
.brand { margin: 0; color: var(--ink); font-weight: 600; letter-spacing: .32em; font-size: 13px; text-transform: uppercase; }
.brand span { color: var(--muted); letter-spacing: .12em; font-weight: 400; margin-left: .35em; }
.panel { background: var(--surface); border: 1px solid var(--line); border-radius: 8px; padding: 32px 28px; display: grid; gap: 20px; }
.label { margin: 0; font-size: 12px; letter-spacing: .14em; text-transform: uppercase; color: var(--muted); }
h1 { margin: 0; color: var(--ink); font-weight: 600; font-size: clamp(28px, 7vw, 34px); line-height: 1.1; letter-spacing: -.015em; text-wrap: balance; }
h1 em { display: block; font: italic 400 .82em/1.2 var(--serif); color: var(--text); letter-spacing: 0; margin-top: 6px; }
.lead { margin: 0; }
form { display: grid; gap: 12px; }
label { font-size: 13px; color: var(--muted); }
input { width: 100%; font: 600 26px/1 var(--sans); letter-spacing: .5em; text-align: center; padding: 16px 12px 16px calc(12px + .5em); color: var(--ink); background: var(--bg); border: 1px solid var(--line-strong); border-radius: 6px; font-variant-numeric: tabular-nums; }
input::placeholder { color: #3a3a3d; }
input:focus-visible, button:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
button { font: 600 15px/1 var(--sans); padding: 16px 18px; min-height: 48px; color: var(--bg); background: var(--ink); border: 0; border-radius: 6px; cursor: pointer; }
button[disabled] { opacity: .6; cursor: progress; }
.msg { margin: 0; min-height: 1.4em; font-size: 14px; color: var(--error); }
.foot { margin: 0; font-size: 13px; color: var(--muted); }
@media (prefers-reduced-motion: no-preference) { .panel { animation: rise .5s cubic-bezier(.2,.7,.2,1) both; } @keyframes rise { from { opacity: .001; transform: translateY(8px); } } }
</style>
</head>
<body>
<main>
  <p class="brand">Axiom<span>Web</span></p>
  <section class="panel" aria-labelledby="title">
    <p class="label">Private preview</p>
    <h1 id="title">${escapeHtml(args.client)}<em>Homepage design mockup</em></h1>
    <p class="lead">Prepared for ${escapeHtml(args.for)}. Enter the 6-digit PIN from Aidan's email to open it.</p>
    <form id="gate" novalidate>
      <label for="pin">PIN</label>
      <input id="pin" name="pin" type="text" inputmode="numeric" autocomplete="one-time-code" pattern="[0-9]*" maxlength="6" placeholder="••••••" required>
      <button type="submit" id="open">Open the preview</button>
      <p class="msg" id="msg" role="status" aria-live="polite"></p>
    </form>
  </section>
  <p class="foot">This is a design mockup, not a live website. The link works until ${escapeHtml(untilText)}.</p>
</main>
<script type="application/json" id="payload">${JSON.stringify(payload)}</script>
<script>
(function () {
  var P = JSON.parse(document.getElementById('payload').textContent);
  var form = document.getElementById('gate'), input = document.getElementById('pin'), button = document.getElementById('open'), msg = document.getElementById('msg');
  var store = 'axiom-preview:' + P.k;
  function bytes(b64) { var s = atob(b64), out = new Uint8Array(s.length); for (var i = 0; i < s.length; i++) out[i] = s.charCodeAt(i); return out; }
  function lock(text) { msg.textContent = text; input.disabled = true; button.disabled = true; }
  if (Date.now() > new Date(P.u + 'T23:59:59-05:00').getTime()) { lock('This preview has ended. Ask Aidan for a fresh link.'); return; }
  if (!(window.crypto && crypto.subtle)) { lock('This browser cannot open the preview. Please try Safari, Chrome or Edge.'); return; }
  function open(pin) {
    return crypto.subtle.importKey('raw', new TextEncoder().encode(pin), 'PBKDF2', false, ['deriveKey'])
      .then(function (m) { return crypto.subtle.deriveKey({ name: 'PBKDF2', salt: bytes(P.s), iterations: P.n, hash: 'SHA-256' }, m, { name: 'AES-GCM', length: 256 }, false, ['decrypt']); })
      .then(function (k) { return crypto.subtle.decrypt({ name: 'AES-GCM', iv: bytes(P.i) }, k, bytes(P.d)); })
      .then(function (buf) {
        try { localStorage.setItem(store, pin); } catch (e) {}
        var html = new TextDecoder().decode(buf);
        document.open(); document.write(html); document.close();
        return true;
      }, function () { return false; });
  }
  input.addEventListener('input', function () { input.value = input.value.replace(/\\D/g, '').slice(0, 6); msg.textContent = ''; });
  form.addEventListener('submit', function (event) {
    event.preventDefault();
    var pin = input.value.replace(/\\D/g, '');
    if (pin.length !== 6) { msg.textContent = 'The PIN has 6 digits.'; input.focus(); return; }
    button.disabled = true; button.textContent = 'Opening\\u2026';
    open(pin).then(function (ok) {
      if (ok) return;
      setTimeout(function () {
        msg.textContent = 'That PIN did not match. Check Aidan\\u2019s email and try again.';
        button.disabled = false; button.textContent = 'Open the preview'; input.select();
      }, 700);
    });
  });
  var saved = null; try { saved = localStorage.getItem(store); } catch (e) {}
  if (saved) open(saved).then(function (ok) { if (!ok) { try { localStorage.removeItem(store); } catch (e) {} } });
  else input.focus();
})();
</script>
</body>
</html>
`;
writeFileSync(join(outDir, 'index.html'), page);
console.log(`Built ${outDir}/index.html (${Math.round(page.length / 1024)} KB, ${fontCount} font files). Live at /preview/${args.slug}/ until ${args.until}.`);
