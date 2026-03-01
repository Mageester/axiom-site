import React, { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  image?: string;
  schema?: Record<string, any>;
}

const DEFAULT_OG_IMAGE = '/og-image.png';
const SITE_URL = 'https://getaxiom.ca';

export const SEO: React.FC<SEOProps> = ({ title, description, image, schema }) => {
  useEffect(() => {
    document.title = title;

    const ogImage = image || DEFAULT_OG_IMAGE;
    const fullImageUrl = ogImage.startsWith('http') ? ogImage : `${SITE_URL}${ogImage}`;

    const metaTags: Record<string, string> = {
      'description': description,
      'og:title': title,
      'og:description': description,
      'og:image': fullImageUrl,
      'og:type': 'website',
      'og:url': SITE_URL,
      'og:site_name': 'Axiom Infrastructure',
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

    // JSON-LD Schema
    let scriptTag = document.querySelector('script[type="application/ld+json"]') as HTMLScriptElement;
    if (schema) {
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.setAttribute('type', 'application/ld+json');
        document.head.appendChild(scriptTag);
      }
      scriptTag.textContent = JSON.stringify(schema);
    } else if (scriptTag) {
      scriptTag.remove();
    }

    return () => {
      if (scriptTag && document.head.contains(scriptTag)) {
        scriptTag.remove();
      }
    };
  }, [title, description, image, schema]);

  return null;
};
