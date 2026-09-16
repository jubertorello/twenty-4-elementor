'use client';

import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const PROSE_CLASSES = `
  text-white/60 text-lg leading-relaxed
  [&_h2]:text-2xl [&_h2]:font-black [&_h2]:text-white [&_h2]:mt-10 [&_h2]:mb-3 [&_h2]:uppercase [&_h2]:tracking-widest
  [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-white/80 [&_h3]:mt-6 [&_h3]:mb-2
  [&_p]:mb-4
  [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ul]:space-y-1
  [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_ol]:space-y-1
  [&_strong]:text-white [&_strong]:font-bold
  [&_em]:italic [&_em]:text-white/70
  [&_a]:text-brand-crimson [&_a]:underline [&_a]:hover:opacity-70
  [&_hr]:border-white/10 [&_hr]:my-8
`;

interface LegalData {
  company_name: string;
  company_cif: string;
  company_address: string;
  company_email: string;
  legal_notice_es: string;
  legal_notice_en: string;
  privacy_es: string;
  privacy_en: string;
}

interface LegalPageClientProps {
  data: LegalData;
  lang: 'es' | 'en';
  type: 'legal' | 'privacy';
}

export default function LegalPageClient({ data, lang, type }: LegalPageClientProps) {
  const router = useRouter();

  const isLegal = type === 'legal';
  const content = isLegal
    ? (lang === 'es' ? data.legal_notice_es : data.legal_notice_en)
    : (lang === 'es' ? data.privacy_es : data.privacy_en);

  const t = {
    back: lang === 'es' ? 'Volver' : 'Back',
    label: 'Legal',
    title: isLegal
      ? (lang === 'es' ? 'Aviso Legal' : 'Legal Notice')
      : (lang === 'es' ? 'Política de Privacidad' : 'Privacy Policy'),
    ownerLabel: isLegal
      ? (lang === 'es' ? 'Datos del Titular' : 'Owner Details')
      : (lang === 'es' ? 'Responsable del Tratamiento' : 'Data Controller'),
    company: lang === 'es' ? 'Empresa:' : 'Company:',
    address: lang === 'es' ? 'Dirección:' : 'Address:',
    empty: lang === 'es'
      ? 'El contenido de esta página está siendo preparado.'
      : 'The content of this page is being prepared.',
    crossLink: isLegal
      ? (lang === 'es' ? 'Política de Privacidad →' : 'Privacy Policy →')
      : (lang === 'es' ? 'Aviso Legal →' : 'Legal Notice →'),
    crossHref: isLegal
      ? `/politica-de-privacidad?lang=${lang}`
      : `/aviso-legal?lang=${lang}`,
  };

  return (
    <main className="min-h-screen bg-brand-almost-black text-white font-sans selection:bg-brand-crimson selection:text-white">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-brand-almost-black/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-4xl mx-auto px-6 h-20 flex items-center">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-white/50 hover:text-white transition-colors group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm uppercase tracking-widest font-bold">{t.back}</span>
          </button>
        </div>
      </nav>

      <div className="pt-40 pb-32 px-6">
        <article className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-16"
          >
            <div className="space-y-4">
              <span className="text-[10px] uppercase tracking-[0.3em] font-black text-brand-crimson">{t.label}</span>
              <h1 className="text-5xl md:text-7xl font-display font-black leading-tight">{t.title}</h1>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-none p-6 space-y-3">
              <h2 className="text-[10px] uppercase tracking-widest font-black text-white/30">{t.ownerLabel}</h2>
              <div className="space-y-1.5 text-sm">
                {data.company_name && <p><span className="text-white/40 mr-2 font-bold">{t.company}</span><span className="text-white">{data.company_name}</span></p>}
                {data.company_cif && <p><span className="text-white/40 mr-2 font-bold">CIF/NIF:</span><span className="text-white">{data.company_cif}</span></p>}
                {data.company_address && <p><span className="text-white/40 mr-2 font-bold">{t.address}</span><span className="text-white">{data.company_address}</span></p>}
                {data.company_email && <p><span className="text-white/40 mr-2 font-bold">Email:</span><a href={`mailto:${data.company_email}`} className="text-brand-crimson hover:underline">{data.company_email}</a></p>}
              </div>
            </div>

            {content?.trim() ? (
              <div
                className={PROSE_CLASSES}
                dangerouslySetInnerHTML={{ __html: content }}
              />
            ) : (
              <p className="text-white/30 text-sm italic">{t.empty}</p>
            )}

            <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row gap-4 text-xs uppercase tracking-widest font-bold text-white/30">
              <Link href={t.crossHref} className="hover:text-white transition-colors">{t.crossLink}</Link>
              <button onClick={() => router.back()} className="hover:text-white transition-colors text-left">
                {lang === 'es' ? 'Inicio →' : 'Home →'}
              </button>
            </div>
          </motion.div>
        </article>
      </div>

      <footer className="border-t border-white/5 py-12 bg-brand-almost-black">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-white/20 text-xs uppercase tracking-widest">
            © {new Date().getFullYear()} {data.company_name || 'Twenty4 Studios'}. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
