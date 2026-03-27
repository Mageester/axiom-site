import React, { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  image?: string;
  canonicalPath?: string;
}

const DEFAULT_OG_IMAGE = '/og-image.png';
const SITE_URL = 'https://getaxiom.ca';

function getCanonicalUrl(canonicalPath?: string) {
  if (canonicalPath) {
    return new URL(canonicalPath, SITE_URL).toString();
  }

  if (typeof window !== 'undefined') {
    return `${window.location.origin}${window.location.pathname}`;
  }

  return SITE_URL;
}

export const SEO: React.FC<SEOProps> = ({ title, description, image, canonicalPath }) => {
  useEffect(() => {
    document.title = title;

    const ogImage = image || DEFAULT_OG_IMAGE;
    const fullImageUrl = ogImage.startsWith('http') ? ogImage : `${SITE_URL}${ogImage}`;
    const canonicalUrl = getCanonicalUrl(canonicalPath);

    const metaTags: Record<string, string> = {
      'description': description,
      'og:title': title,
      'og:description': description,
      'og:image': fullImageUrl,
      'og:type': 'website',
      'og:url': canonicalUrl,
      'og:site_name': 'Axiom',
      'twitter:card': 'summary_large_image',
      'twitter:title': title,
      'twitter:description': description,
      'twitter:image': fullImageUrl,
    };

    Object.entries(metaTags).forEach(([key, value]) => {
      const isOg = key.startsWith('og:');
      const isTwitter = key.startsWith('twitter:');
      const attr = isOg || isTwitter ? 'property' : 'name';

      let el = document.querySelector(`meta[${attr}="${key}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute('content', value);
    });

    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonicalUrl);

  }, [title, description, image, canonicalPath]);

  return null;
};
