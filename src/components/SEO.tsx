import React, { useEffect } from 'react';
import {
  DEFAULT_OG_IMAGE,
  DEFAULT_SEO_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
  formatSeoTitle,
  toCanonicalUrl,
} from '../lib/seo';

interface SEOProps {
  title?: string;
  description?: string;
  canonicalPath?: string;
  image?: string;
  noIndex?: boolean;
  schema?: Record<string, unknown>;
}
const MANAGED_ATTR = 'data-axiom-seo';

const upsertUniqueHeadTag = <T extends HTMLElement>(selector: string, create: () => T) => {
  const existing = Array.from(document.head.querySelectorAll(selector)) as T[];
  const primary = existing[0] ?? create();

  if (!existing[0]) {
    document.head.appendChild(primary);
  }

  for (let index = 1; index < existing.length; index += 1) {
    existing[index].remove();
  }

  primary.setAttribute(MANAGED_ATTR, 'true');
  return primary;
};

const removeLegacyMetaVariant = (key: string) => {
  const legacyAttr = key.startsWith('og:') ? 'name' : key.startsWith('twitter:') ? 'property' : null;
  if (!legacyAttr) return;

  Array.from(document.head.querySelectorAll(`meta[${legacyAttr}="${key}"]`)).forEach((node) => {
    node.remove();
  });
};

const upsertMetaTag = (key: string, value: string) => {
  removeLegacyMetaVariant(key);
  const isOg = key.startsWith('og:');
  const attr = isOg ? 'property' : 'name';
  const selector = `meta[${attr}="${key}"]`;
  const el = upsertUniqueHeadTag<HTMLMetaElement>(selector, () => {
    const node = document.createElement('meta');
    node.setAttribute(attr, key);
    return node;
  });

  el.setAttribute('content', value);
};

const upsertCanonicalLink = (href: string) => {
  const selector = 'link[rel="canonical"]';
  const el = upsertUniqueHeadTag<HTMLLinkElement>(selector, () => {
    const node = document.createElement('link');
    node.setAttribute('rel', 'canonical');
    return node;
  });

  el.setAttribute('href', href);
};

const syncTitleTag = (value: string) => {
  const existing = Array.from(document.head.querySelectorAll('title'));
  const primary = existing[0] ?? document.createElement('title');

  if (!existing[0]) {
    document.head.appendChild(primary);
  }

  for (let index = 1; index < existing.length; index += 1) {
    existing[index].remove();
  }

  primary.setAttribute(MANAGED_ATTR, 'true');
  primary.textContent = value;
  document.title = value;
};

const syncSchema = (schema?: Record<string, unknown>) => {
  const existing = Array.from(document.head.querySelectorAll('script[type="application/ld+json"]'));
  existing.forEach((node) => node.remove());

  if (!schema) {
    return;
  }

  const scriptTag = document.createElement('script');
  scriptTag.setAttribute('type', 'application/ld+json');
  scriptTag.dataset.axiomSeo = 'true';
  scriptTag.textContent = JSON.stringify(schema);
  document.head.appendChild(scriptTag);
};

export const SEO: React.FC<SEOProps> = ({ title, description, canonicalPath, image, noIndex, schema }) => {
  useEffect(() => {
    const resolvedTitle = formatSeoTitle(title);
    const resolvedDescription = description?.trim() || DEFAULT_SEO_DESCRIPTION;
    const pageUrl = canonicalPath ? toCanonicalUrl(canonicalPath) : toCanonicalUrl(typeof window === 'undefined' ? '/' : window.location.pathname);
    const ogImage = image || DEFAULT_OG_IMAGE;
    const fullImageUrl = ogImage.startsWith('http') ? ogImage : `${SITE_URL}${ogImage}`;

    const metaTags: Record<string, string> = {
      'description': resolvedDescription,
      'robots': noIndex ? 'noindex,nofollow' : 'index,follow,max-image-preview:large',
      'og:title': resolvedTitle,
      'og:description': resolvedDescription,
      'og:image': fullImageUrl,
      'og:type': 'website',
      'og:url': pageUrl,
      'og:site_name': SITE_NAME,
      'twitter:card': 'summary_large_image',
      'twitter:title': resolvedTitle,
      'twitter:description': resolvedDescription,
      'twitter:image': fullImageUrl,
    };

    syncTitleTag(resolvedTitle);

    Object.entries(metaTags).forEach(([key, value]) => {
      upsertMetaTag(key, value);
    });

    upsertCanonicalLink(pageUrl);

    syncSchema(schema);
  }, [title, description, canonicalPath, image, noIndex, schema]);

  return null;
};
