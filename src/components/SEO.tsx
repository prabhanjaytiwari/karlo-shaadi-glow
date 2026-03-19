import { Helmet } from "react-helmet-async";

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  /** For article pages */
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  /** Prevent indexing (auth pages, etc.) */
  noindex?: boolean;
  /** Breadcrumb items for schema */
  breadcrumbs?: Array<{ name: string; url: string }>;
}

const SITE_URL = "https://karloshaadi.com";
const SITE_NAME = "Karlo Shaadi";

export const SEO = ({
  title,
  description,
  keywords = "wedding planning, indian wedding, wedding vendors, wedding services, karlo shaadi, shaadi, vivah, wedding photographer, wedding venue, wedding caterer",
  image = "/og-image.jpg",
  url,
  type = "website",
  publishedTime,
  modifiedTime,
  author,
  noindex = false,
  breadcrumbs,
}: SEOProps) => {
  const fullTitle = `${title} | ${SITE_NAME} - India's #1 Wedding Planning Platform`;
  const canonicalUrl = url
    ? url.startsWith("http")
      ? url
      : `${SITE_URL}${url}`
    : typeof window !== "undefined"
    ? window.location.href
    : SITE_URL;
  const imageUrl = image.startsWith("http")
    ? image
    : `${SITE_URL}${image}`;

  const breadcrumbSchema =
    breadcrumbs && breadcrumbs.length > 0
      ? JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Home",
              item: SITE_URL,
            },
            ...breadcrumbs.map((crumb, idx) => ({
              "@type": "ListItem",
              position: idx + 2,
              name: crumb.name,
              item: crumb.url.startsWith("http")
                ? crumb.url
                : `${SITE_URL}${crumb.url}`,
            })),
          ],
        })
      : null;

  const articleSchema =
    type === "article" && publishedTime
      ? JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: title,
          description,
          image: imageUrl,
          author: {
            "@type": "Person",
            name: author || "Karlo Shaadi Editorial Team",
          },
          publisher: {
            "@type": "Organization",
            name: SITE_NAME,
            logo: {
              "@type": "ImageObject",
              url: `${SITE_URL}/favicon.png`,
            },
          },
          datePublished: publishedTime,
          dateModified: modifiedTime || publishedTime,
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": canonicalUrl,
          },
        })
      : null;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={canonicalUrl} />
      <meta
        name="robots"
        content={
          noindex
            ? "noindex, nofollow"
            : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
        }
      />
      <meta name="language" content="English" />
      <meta name="author" content={author || SITE_NAME} />
      <meta name="revisit-after" content="7 days" />

      {/* Geo targeting */}
      <meta name="geo.region" content="IN" />
      <meta name="geo.country" content="India" />
      <meta name="ICBM" content="26.8467, 80.9462" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={title} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="en_IN" />

      {/* Article-specific OG tags */}
      {type === "article" && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {type === "article" && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      {type === "article" && author && (
        <meta property="article:author" content={author} />
      )}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@karloshaadi" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:image:alt" content={title} />

      {/* Mobile Optimization */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="theme-color" content="#db2777" />
      <meta name="apple-mobile-web-app-capable" content="yes" />

      {/* Structured Data: Breadcrumbs */}
      {breadcrumbSchema && (
        <script type="application/ld+json">{breadcrumbSchema}</script>
      )}

      {/* Structured Data: Article */}
      {articleSchema && (
        <script type="application/ld+json">{articleSchema}</script>
      )}
    </Helmet>
  );
};
