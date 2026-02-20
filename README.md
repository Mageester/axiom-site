# Axiom Infrastructure - Production Web Architecture

A production-ready static marketing site built with Vite, React, and Tailwind CSS.
Designed for a dark, institutional aesthetic, prioritizing high performance and accessibility.

## Infrastructure Stack
* **Framework:** React 18 + Vite (Fully Static)
* **Styling:** Tailwind CSS
* **Typography:** Space Grotesk (Headings), Inter (Body)
* **Colors:** Dark Background (`#0B0B0C`), Surface (`#15171A`), Accent (`#4B6EAF`)

## Assets
We have provided a fallback SVG logo (`public/logo.svg`).
**Action Required:** Please place your provided Axiom Infrastructure logo image at `public/logo.png`. The application is already configured to prioritize `logo.png` and will fallback to `logo.svg` if the image is missing. 

## Local Development & Build Commands

Ensure you have [Node.js](https://nodejs.org/) installed (v18+ recommended).

1. **Install Dependencies:**
   ```bash
   npm install
   ```
2. **Start Local Development Server:**
   ```bash
   npm run dev
   ```
3. **Build Static Application (for Production):**
   ```bash
   npm run build
   ```
4. **Preview Production Build Locally:**
   ```bash
   npm run preview
   ```

## Cloudflare Pages Deployment Instructions

This application is configured as a fully static, client-side application without a Node.js server requirement, making it perfect for edge deployment via Cloudflare Pages.

1. **Push to Repository:**
   Commit this entire directory to a Git repository (GitHub/GitLab).

2. **Connect to Cloudflare Pages:**
   - Log into your Cloudflare Dashboard and navigate to **Workers & Pages** -> **Create Application** -> **Pages** -> **Connect to Git**.
   - Select your repository.

3. **Configure Build Settings:**
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Build Output Directory:** `dist`

4. **Deploy:**
   Click **Save and Deploy**. Cloudflare will automatically provision your global CDN infrastructure, build the static assets, and deploy to the edge nodes.
   
5. **(Optional) Custom Domain:**
   After deployment, go to the "Custom Domains" tab in your Cloudflare Pages project to map your production domain.

## Lighthouse & Performance Optimization
- **Accessibility:** Uses semantic HTML, proper contrast ratios, and accessible form labels.
- **Performance:** Implements highly localized asset bundling and defers JS initialization where appropriate. No heavy external frameworks were used outside of React & Tailwind.
