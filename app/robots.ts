import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/'], // Bloquear acceso a rastreadores en la sección de administración
    },
    sitemap: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://twenty4studios.com'}/sitemap.xml`,
  };
}
