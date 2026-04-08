import React, { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  image?: string;
  schema?: Record<string, any>;
}

const DEFAULT_OG_IMAGE = '/og-image.png';
const SITE_URL = 'https://getaxiom.ca';

const getPageUrl = () => {
  if (typeof window === 'undefined') {
    return SITE_URL;
  }

  return new URL(window.location.pathname, SITE_URL).toString();
};

const setMetaTag = (key: string, value: string) => {
  const isOg = key.startsWith('og:');
  const isTwitter = key.startsWith('twitter:');
  const attr = isOg || isTwitter ? 'property' : 'name';
  const selector = `meta[${attr}="${key}"]`;

  let el = document.querySelector(selector) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }

  el.setAttribute('content', value);
};

const setCanonicalLink = (href: string) => {
  let el = document.querySelector('link[rel="canonical"][data-axiom-canonical="true"]') as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    el.setAttribute('data-axiom-canonical', 'true');
    document.head.appendChild(el);
  }

  el.setAttribute('href', href);
};

export const SEO: React.FC<SEOProps> = ({ title, description, image, schema }) => {
  useEffect(() => {
    document.title = title;

    const pageUrl = getPageUrl();
    const ogImage = image || DEFAULT_OG_IMAGE;
    const fullImageUrl = ogImage.startsWith('http') ? ogImage : `${SITE_URL}${ogImage}`;

    const metaTags: Record<string, string> = {
      'description': description,
      'robots': 'index,follow,max-image-preview:large',
      'og:title': title,
      'og:description': description,
      'og:image': fullImageUrl,
      'og:type': 'website',
      'og:url': pageUrl,
      'og:site_name': 'Axiom',
      'twitter:card': 'summary_large_image',
      'twitter:title': title,
      'twitter:description': description,
      'twitter:image': fullImageUrl,
    };

    Object.entries(metaTags).forEach(([key, value]) => {
      setMetaTag(key, value);
    });

    setCanonicalLink(pageUrl);

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
