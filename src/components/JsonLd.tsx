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
    
    // Remove existing FAQ schema if any
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
      "description": `Find the best wedding ${category?.toLowerCase() || 'vendors'} in ${city}. Verified vendors, real reviews, secure payments.`,
      "url": `https://karloshaadi.com/vendors/${city.toLowerCase()}${category ? '/' + category : ''}`,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": city,
        "addressCountry": "IN"
      },
      "areaServed": { "@type": "City", "name": city },
      "priceRange": "₹₹₹"
    });
    
    const existing = document.getElementById('local-business-jsonld');
    if (existing) existing.remove();
    
    document.head.appendChild(script);
    return () => { script.remove(); };
  }, [city, category]);

  return null;
};
