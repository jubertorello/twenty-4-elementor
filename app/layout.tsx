import type {Metadata} from 'next';
import './globals.css';

import { supabaseServer } from '@/lib/supabase-server';

export async function generateMetadata(): Promise<Metadata> {
  let settings: any = {};
  try {
    const { data } = await supabaseServer.from('site_settings').select('data').eq('id', 'general').single();
    if (data?.data) settings = data.data;
  } catch (e) {
    console.error('Error fetching global metadata:', e);
  }

  const siteTitle = settings.site_name || 'TWENTY4 STUDIOS';
  const siteDesc = settings.site_description_es || 'Editorial, premium, fashion-tech studio connecting brands and athletes.';

  return {
    title: {
      default: siteTitle,
      template: `%s | ${siteTitle}`
    },
    description: siteDesc,
    icons: {
      icon: settings.favicon_url || '/favicon.ico',
      shortcut: settings.favicon_url || '/favicon.ico',
      apple: settings.favicon_url || '/favicon.ico',
    },
    openGraph: {
      title: siteTitle,
      description: siteDesc,
      images: settings.og_image ? [settings.og_image] : [],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: siteTitle,
      description: siteDesc,
      images: settings.og_image ? [settings.og_image] : [],
    }
  };
}

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="es">
      <body suppressHydrationWarning className="bg-[#e2dbd0] text-[#22330D] antialiased">
        {children}
      </body>
    </html>
  );
}
