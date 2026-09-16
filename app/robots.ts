import { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Backoffice y endpoints internos. /api/og y /api/icon quedan accesibles.
      disallow: ['/admin/', '/login', '/api/media/', '/api/cloudinary/'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
