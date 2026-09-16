import type { Metadata } from 'next';
import { supabaseServer } from '@/lib/supabase-server';
import LandingPageClient from './LandingPageClient';

export const metadata: Metadata = {
  alternates: {
    canonical: '/',
    languages: { es: '/', en: '/?lang=en' },
  },
};

// ISR: revalidate every 60 seconds so CMS changes propagate within 1 minute
export const revalidate = 60;

export default async function Page() {
  const [settingsRes, projectsRes, talentsRes] = await Promise.all([
    supabaseServer
      .from('site_settings')
      .select('id, data')
      .in('id', ['general', 'hero', 'presentation', 'projects', 'talents', 'about']),
    supabaseServer
      .from('projects')
      .select('*')
      .eq('is_archived', false)
      .order('order_index', { ascending: true })
      .limit(6),
    supabaseServer
      .from('talents')
      .select('*')
      .eq('is_archived', false)
      .order('order_index', { ascending: true }),
  ]);

  const settings: Record<string, any> = Object.fromEntries(
    (settingsRes.data || []).map((row) => [row.id, row.data || {}])
  );

  return (
    <LandingPageClient
      settings={settings}
      projects={projectsRes.data || []}
      talents={talentsRes.data || []}
    />
  );
}
