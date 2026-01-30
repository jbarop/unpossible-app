import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  canonicalPath?: string;
  type?: "website" | "article";
  noIndex?: boolean;
}

const DEFAULT_TITLE = "Umpossible - Ralph Wiggum Quotes";
const DEFAULT_DESCRIPTION =
  "Me fail English? That's unpossible! Enjoy the best Ralph Wiggum quotes from The Simpsons.";
const SITE_NAME = "Umpossible";

export function SEO({
  title,
  description = DEFAULT_DESCRIPTION,
  canonicalPath,
  type = "website",
  noIndex = false,
}: SEOProps) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : DEFAULT_TITLE;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE_NAME} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />

      {/* Canonical URL */}
      {canonicalPath && <link rel="canonical" href={canonicalPath} />}

      {/* Robots */}
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
    </Helmet>
  );
}
