/**
 * Datos del sitio compartidos por metadatos, sitemap, robots y manifest.
 *
 * La URL canónica sale de NEXT_PUBLIC_SITE_URL (configurar en Vercel). El valor
 * por defecto es la versión con www: es la dirección de producción y la que
 * deben usar canonical, sitemap y og:url para no partir el posicionamiento
 * entre twenty4studios.com y www.twenty4studios.com.
 */

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.twenty4studios.com').replace(/\/+$/, '');

export const SITE_NAME = 'Twenty4 Studios';

export const BRAND = {
  almostBlack: '#161616',
  warmLux: '#f0ede8',
  crimson: '#ba090b',
} as const;

/** Trazado del isotipo (dos estrellas), viewBox 0 0 938.16 448.99. */
export const STARS_POLYGONS = [
  '606.43 115.41 420.52 115.41 466.72 0 308.48 115.41 123.92 115.41 216.18 183.79 0 340.62 269.74 242.99 328.95 340.53 395.59 199.47 606.43 115.41',
  '752.24 223.79 798.44 108.37 640.21 223.79 455.64 223.79 547.91 292.16 331.73 448.99 601.46 351.36 660.67 448.9 727.32 307.84 938.16 223.79 752.24 223.79',
];

/**
 * Quita un " | Twenty4 Studios" (o " - Twenty4 Studios") final. El admin lo
 * añade automáticamente al meta título de los proyectos, y la plantilla de
 * títulos del layout ya lo agrega: sin esto sale repetido.
 */
export function stripSiteSuffix(title: string, siteName: string = SITE_NAME): string {
  const escaped = siteName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return (title || '').replace(new RegExp(`\\s*[|\\-–—]\\s*${escaped}\\s*$`, 'i'), '').trim();
}
