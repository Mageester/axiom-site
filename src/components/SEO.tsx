import React, { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  schema?: Record<string, any>;
}

export const SEO: React.FC<SEOProps> = ({ title, description, schema }) => {
  useEffect(() => {
    // Update title
    document.title = title;

    // Update meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', description);

    // Update JSON-LD Schema
    let scriptTag = document.querySelector('script[type="application/ld+json"]') as HTMLScriptElement;
    
    if (schema) {
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.setAttribute('type', 'application/ld+json');
        document.head.appendChild(scriptTag);
      }
      scriptTag.textContent = JSON.stringify(schema);
    } else {
      // Remove existing if no schema provided down the route tree
      if (scriptTag) {
        scriptTag.remove();
      }
    }

    return () => {
      // Cleanup schema on unmount to prevent leaks to other routes
      if (scriptTag && document.head.contains(scriptTag)) {
         scriptTag.remove();
      }
    };
  }, [title, description, schema]);

  return null;
};
