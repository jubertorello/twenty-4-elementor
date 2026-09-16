import type { Metadata, Viewport } from 'next';
import './globals.css';
import { supabaseServer } from '@/lib/supabase-server';
import { SITE_URL, SITE_NAME, BRAND } from '@/lib/site';
import { externalUrl } from '@/lib/utils';

const BASE_URL = SITE_URL;

export const viewport: Viewport = {
  themeColor: BRAND.almostBlack,
};

// Shared fetch so generateMetadata and RootLayout don't double-fetch
async function getSiteSettings() {
  try {
    const { data } = await supabaseServer
      .from('site_settings')
      .select('data')
      .eq('id', 'general')
      .single();
    return (data?.data as Record<string, string>) || {};
  } catch {
    return {};
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  // El campo "Meta título" del admin (SEO & Redes) manda; si está vacío, el nombre del sitio.
  const siteTitle = settings.meta_title || settings.site_name || SITE_NAME;
  const siteDesc = settings.site_description_es || 'Editorial, premium, fashion-tech studio connecting brands and athletes.';
  const ogImage = settings.og_image || `${BASE_URL}/api/og`;

  return {
    metadataBase: new URL(BASE_URL),
    title: {
      default: siteTitle,
      template: `%s | ${siteTitle}`,
    },
    description: siteDesc,
    icons: {
      icon: settings.favicon_url || '/favicon.svg',
      shortcut: settings.favicon_url || '/favicon.svg',
      apple: settings.favicon_url || '/api/icon?size=180',
    },
    // Sin canonical aquí: cada página declara el suyo. Uno global lo heredaban
    // todas las páginas y apuntaban a la home.
    openGraph: {
      title: siteTitle,
      description: siteDesc,
      images: [{ url: ogImage, width: 1200, height: 630, alt: siteTitle }],
      type: 'website',
      url: BASE_URL,
      siteName: siteTitle,
      locale: 'es_ES',
    },
    twitter: {
      card: 'summary_large_image',
      title: siteTitle,
      description: siteDesc,
      images: [ogImage],
    },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();

  const orgJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: settings.site_name || SITE_NAME,
    url: BASE_URL,
    logo: settings.header_logo_url || `${BASE_URL}/api/icon?size=512`,
    description: settings.site_description_es || 'Editorial, premium, fashion-tech studio connecting brands and athletes.',
    email: settings.email || 'hello@twenty4studios.com',
    sameAs: [
      externalUrl(settings.instagram_url),
      externalUrl(settings.linkedin_url),
    ].filter(Boolean),
    contactPoint: {
      '@type': 'ContactPoint',
      email: settings.email || 'hello@twenty4studios.com',
      contactType: 'customer service',
    },
  };

  return (
    <html lang="es">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
      </head>
      <body suppressHydrationWarning className="bg-brand-almost-black text-brand-warm-lux antialiased">
        {children}
      </body>
    </html>
  );
}
