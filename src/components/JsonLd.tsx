import { useEffect } from 'react';

/**
 * FAQPageJsonLd — injects FAQ structured data for Google rich snippets.
 * Usage: <FAQPageJsonLd faqs={[{ question: "...", answer: "..." }]} />
 */
interface FAQItem {
  question: string;
  answer: string;
}

export const FAQPageJsonLd = ({ faqs }: { faqs: FAQItem[] }) => {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'faq-jsonld';
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    });

    const existing = document.getElementById('faq-jsonld');
    if (existing) existing.remove();

    document.head.appendChild(script);
    return () => { script.remove(); };
  }, [faqs]);

  return null;
};

/**
 * LocalBusinessJsonLd — for city-specific pages
 */
export const LocalBusinessJsonLd = ({ city, category }: { city: string; category?: string }) => {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'local-business-jsonld';
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": `Karlo Shaadi - Wedding ${category || 'Vendors'} in ${city}`,
      "description": `Find the best wedding ${category?.toLowerCase() || 'vendors'} in ${city}. Verified vendors, real reviews, secure milestone payments. Browse portfolios and book with confidence.`,
      "url": `https://karloshaadi.com/vendors/${city.toLowerCase()}${category ? '/' + category : ''}`,
      "logo": "https://karloshaadi.com/favicon.png",
      "image": "https://karloshaadi.com/og-image.jpg",
      "telephone": "+917011460321",
      "email": "hello@karloshaadi.com",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": city,
        "addressCountry": "IN"
      },
      "areaServed": { "@type": "City", "name": city },
      "priceRange": "₹₹-₹₹₹₹",
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "reviewCount": "1250",
        "bestRating": "5"
      },
      "sameAs": [
        "https://www.instagram.com/karloshaadiofficial/",
        "https://www.facebook.com/profile.php?id=61584618427446"
      ]
    });

    const existing = document.getElementById('local-business-jsonld');
    if (existing) existing.remove();

    document.head.appendChild(script);
    return () => { script.remove(); };
  }, [city, category]);

  return null;
};

/**
 * BreadcrumbJsonLd — adds breadcrumb navigation structured data
 */
interface BreadcrumbItem {
  name: string;
  url: string;
}

export const BreadcrumbJsonLd = ({ items }: { items: BreadcrumbItem[] }) => {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'breadcrumb-jsonld';
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://karloshaadi.com"
        },
        ...items.map((item, idx) => ({
          "@type": "ListItem",
          "position": idx + 2,
          "name": item.name,
          "item": item.url.startsWith('http') ? item.url : `https://karloshaadi.com${item.url}`
        }))
      ]
    });

    const existing = document.getElementById('breadcrumb-jsonld');
    if (existing) existing.remove();

    document.head.appendChild(script);
    return () => { script.remove(); };
  }, [items]);

  return null;
};

/**
 * ArticleJsonLd — for blog posts and editorial content
 */
interface ArticleJsonLdProps {
  title: string;
  description: string;
  url: string;
  image: string;
  datePublished: string;
  dateModified?: string;
  author?: string;
  keywords?: string[];
}

export const ArticleJsonLd = ({
  title,
  description,
  url,
  image,
  datePublished,
  dateModified,
  author = "Karlo Shaadi Editorial Team",
  keywords = [],
}: ArticleJsonLdProps) => {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'article-jsonld';
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": title,
      "description": description,
      "image": image.startsWith('http') ? image : `https://karloshaadi.com${image}`,
      "author": {
        "@type": "Person",
        "name": author
      },
      "publisher": {
        "@type": "Organization",
        "name": "Karlo Shaadi",
        "logo": {
          "@type": "ImageObject",
          "url": "https://karloshaadi.com/favicon.png"
        }
      },
      "datePublished": datePublished,
      "dateModified": dateModified || datePublished,
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": url.startsWith('http') ? url : `https://karloshaadi.com${url}`
      },
      "keywords": keywords.join(', '),
      "inLanguage": "en-IN",
      "about": {
        "@type": "Thing",
        "name": "Indian Wedding Planning"
      }
    });

    const existing = document.getElementById('article-jsonld');
    if (existing) existing.remove();

    document.head.appendChild(script);
    return () => { script.remove(); };
  }, [title, description, url, image, datePublished, dateModified, author, keywords]);

  return null;
};

/**
 * ItemListJsonLd — for category/listing pages (helps with rich snippets)
 */
interface ItemListItem {
  name: string;
  url: string;
  position: number;
}

export const ItemListJsonLd = ({ name, items }: { name: string; items: ItemListItem[] }) => {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'itemlist-jsonld';
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": name,
      "itemListElement": items.map(item => ({
        "@type": "ListItem",
        "position": item.position,
        "name": item.name,
        "url": item.url.startsWith('http') ? item.url : `https://karloshaadi.com${item.url}`
      }))
    });

    const existing = document.getElementById('itemlist-jsonld');
    if (existing) existing.remove();

    document.head.appendChild(script);
    return () => { script.remove(); };
  }, [name, items]);

  return null;
};

/**
 * WebSiteJsonLd — adds WebSite schema with SearchAction for sitelinks search box
 * Should be placed on the homepage only
 */
export const WebSiteJsonLd = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'website-jsonld';
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Karlo Shaadi",
      "alternateName": ["KarloShaadi", "Karlo Shaadi Wedding Platform"],
      "url": "https://karloshaadi.com",
      "description": "India's #1 wedding planning platform. Zero-commission vendor marketplace with verified vendors across 20+ cities.",
      "inLanguage": "en-IN",
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://karloshaadi.com/search?q={search_term_string}"
        },
        "query-input": "required name=search_term_string"
      }
    });

    const existing = document.getElementById('website-jsonld');
    if (existing) existing.remove();

    document.head.appendChild(script);
    return () => { script.remove(); };
  }, []);

  return null;
};

/**
 * ServiceJsonLd — for vendor category pages
 */
interface ServiceJsonLdProps {
  serviceName: string;
  serviceDescription: string;
  city?: string;
  priceRange?: string;
}

export const ServiceJsonLd = ({ serviceName, serviceDescription, city, priceRange }: ServiceJsonLdProps) => {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'service-jsonld';
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Service",
      "name": serviceName,
      "description": serviceDescription,
      "provider": {
        "@type": "Organization",
        "name": "Karlo Shaadi",
        "url": "https://karloshaadi.com"
      },
      "areaServed": city
        ? { "@type": "City", "name": city }
        : { "@type": "Country", "name": "India" },
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": serviceName,
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": serviceName
            },
            "priceRange": priceRange || "₹₹-₹₹₹₹",
            "priceCurrency": "INR",
            "eligibleRegion": {
              "@type": "Country",
              "name": "India"
            }
          }
        ]
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "reviewCount": "1250",
        "bestRating": "5"
      }
    });

    const existing = document.getElementById('service-jsonld');
    if (existing) existing.remove();

    document.head.appendChild(script);
    return () => { script.remove(); };
  }, [serviceName, serviceDescription, city, priceRange]);

  return null;
};
