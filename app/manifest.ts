import { MetadataRoute } from 'next';
import { BRAND, SITE_NAME } from '@/lib/site';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: 'TW4',
    description: 'Estudio creativo en Madrid: contenido, social media y producción para deportistas y marcas.',
    start_url: '/',
    display: 'standalone',
    background_color: BRAND.almostBlack,
    theme_color: BRAND.almostBlack,
    icons: [
      { src: '/favicon.svg', sizes: 'any', type: 'image/svg+xml' },
      { src: '/api/icon?size=192', sizes: '192x192', type: 'image/png' },
      { src: '/api/icon?size=512', sizes: '512x512', type: 'image/png' },
      { src: '/api/icon?size=512&maskable=1', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
