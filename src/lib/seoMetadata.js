// lib/seoMetadata.ts
export function getSeoMeta({
  title = "Jasmina - Your Career Hub",
  description = "Explore your next opportunity with Jasmina.",
  path = "/",
  image = "/default-og-image.jpg",
}) {
  const baseUrl = "https://your-site.com";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: baseUrl + path,
      siteName: "Jasmina",
      images: [
        {
          url: baseUrl + image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [baseUrl + image],
    },
  };
}
