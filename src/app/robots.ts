import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard/', '/onboarding/', '/profile/', '/gallery/'], // Blocks crawlers from tracking user app workflows
    },
    sitemap: 'https://felt-rouge-six.vercel.app/sitemap.xml',
  };
}