import React, { useEffect } from 'react';
import { generateSeoMetadata, SeoSetupData, SeoUserData } from '../utils/seoEngine';

interface SeoHeadProps {
  activeTab?: string;
  selectedSetup?: SeoSetupData | null;
  selectedUser?: SeoUserData | null;
  categoryName?: string;
  tagName?: string;
  hardwareName?: string;
  brandName?: string;
}

export const SeoHead: React.FC<SeoHeadProps> = ({
  activeTab,
  selectedSetup,
  selectedUser,
  categoryName,
  tagName,
  hardwareName,
  brandName
}) => {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const urlParams = new URLSearchParams(window.location.search);
    const queryParams: Record<string, string> = {};
    urlParams.forEach((val, key) => {
      queryParams[key] = val;
    });

    const seo = generateSeoMetadata({
      baseUrl: window.location.origin,
      urlPath: window.location.pathname,
      queryParams,
      setupData: selectedSetup || null,
      userData: selectedUser || null,
      categoryName,
      tagName,
      hardwareName,
      brandName,
      tabName: activeTab
    });

    // 1. Title
    document.title = seo.title;

    // 2. Meta Helper
    const setMeta = (attrName: 'name' | 'property', attrVal: string, contentVal: string) => {
      let el = document.querySelector(`meta[${attrName}="${attrVal}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attrName, attrVal);
        document.head.appendChild(el);
      }
      el.setAttribute('content', contentVal);
    };

    // Description, Keywords, Robots
    setMeta('name', 'description', seo.description);
    setMeta('name', 'keywords', seo.keywords);
    setMeta('name', 'robots', seo.robots);

    // Canonical
    let canonicalEl = document.querySelector('link[rel="canonical"]');
    if (!canonicalEl) {
      canonicalEl = document.createElement('link');
      canonicalEl.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalEl);
    }
    canonicalEl.setAttribute('href', seo.canonicalUrl);

    // OpenGraph
    setMeta('property', 'og:type', seo.ogType);
    setMeta('property', 'og:title', seo.ogTitle);
    setMeta('property', 'og:description', seo.ogDescription);
    setMeta('property', 'og:image', seo.ogImage);
    setMeta('property', 'og:url', seo.ogUrl);
    setMeta('property', 'og:locale', seo.ogLocale);

    // Twitter
    setMeta('name', 'twitter:card', seo.twitterCard);
    setMeta('name', 'twitter:title', seo.twitterTitle);
    setMeta('name', 'twitter:description', seo.twitterDescription);
    setMeta('name', 'twitter:image', seo.twitterImage);

    // JSON-LD Script
    let jsonLdEl = document.getElementById('saios-seo-jsonld');
    if (!jsonLdEl) {
      jsonLdEl = document.createElement('script');
      jsonLdEl.setAttribute('type', 'application/ld+json');
      jsonLdEl.setAttribute('id', 'saios-seo-jsonld');
      document.head.appendChild(jsonLdEl);
    }
    jsonLdEl.textContent = JSON.stringify(seo.jsonLd, null, 2);

    // Hreflang Tags
    document.querySelectorAll('link[rel="alternate"][hreflang]').forEach(el => el.remove());
    seo.hreflangs.forEach(h => {
      const link = document.createElement('link');
      link.setAttribute('rel', 'alternate');
      link.setAttribute('hreflang', h.hreflang);
      link.setAttribute('href', h.href);
      document.head.appendChild(link);
    });

  }, [activeTab, selectedSetup, selectedUser, categoryName, tagName, hardwareName, brandName]);

  return null;
};
