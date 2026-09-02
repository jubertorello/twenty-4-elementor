import type { Metadata } from 'next';
import './globals.css';
import { supabaseServer } from '@/lib/supabase-server';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://twenty4studios.com';

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

  const siteTitle = settings.site_name || 'TWENTY4 STUDIOS';
  const siteDesc = settings.site_description_es || 'Editorial, premium, fashion-tech studio connecting brands and athletes.';
  const ogImage = settings.og_image || `${BASE_URL}/og-default.jpg`;

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
      apple: settings.favicon_url || '/favicon.svg',
    },
    alternates: {
      canonical: BASE_URL,
      languages: {
        'es': BASE_URL,
        'en': `${BASE_URL}?lang=en`,
      },
    },
    openGraph: {
      title: siteTitle,
      description: siteDesc,
      images: [{ url: ogImage, width: 1200, height: 630, alt: siteTitle }],
      type: 'website',
      url: BASE_URL,
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
    name: settings.site_name || 'TWENTY4 STUDIOS',
    url: BASE_URL,
    logo: settings.header_logo_url || `${BASE_URL}/og-default.jpg`,
    description: settings.site_description_es || 'Editorial, premium, fashion-tech studio connecting brands and athletes.',
    email: settings.email || 'hello@twenty4studios.com',
    sameAs: [
      settings.instagram_url,
      settings.linkedin_url,
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
