import { Metadata } from 'next';
import { supabaseServer } from '@/lib/supabase-server';
import LegalPageClient from '@/app/legal/LegalPageClient';

export const revalidate = 3600;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}): Promise<Metadata> {
  const { lang } = await searchParams;
  const isEn = lang === 'en';
  return {
    title: isEn ? 'Privacy Policy' : 'Política de Privacidad',
    description: isEn ? 'Privacy policy and data processing.' : 'Política de privacidad y tratamiento de datos.',
    alternates: { canonical: '/politica-de-privacidad' },
  };
}

const defaultContent = {
  company_name: 'Twenty4 Studios',
  company_cif: '',
  company_address: '',
  company_email: 'hello@twenty4studios.com',
  legal_notice_es: '',
  legal_notice_en: '',
  privacy_es: '',
  privacy_en: '',
};

export default async function PoliticaDePrivacidad({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const { lang: rawLang } = await searchParams;
  const lang = rawLang === 'en' ? 'en' : 'es';

  const { data } = await supabaseServer
    .from('site_settings')
    .select('data')
    .eq('id', 'legal')
    .single();

  const content = { ...defaultContent, ...(data?.data || {}) };

  return <LegalPageClient data={content} lang={lang} type="privacy" />;
}
