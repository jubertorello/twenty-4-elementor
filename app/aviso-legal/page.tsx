'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

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

function LegalContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const lang = (searchParams.get('lang') === 'en' ? 'en' : 'es') as 'es' | 'en';

  const [data, setData] = useState(defaultContent);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('site_settings')
      .select('data')
      .eq('id', 'legal')
      .single()
      .then(({ data: res }) => {
        if (res?.data) setData({ ...defaultContent, ...res.data });
        setLoading(false);
      });
  }, []);

  const content = lang === 'es' ? data.legal_notice_es : data.legal_notice_en;

  const t = {
    back: lang === 'es' ? 'Volver' : 'Back',
    label: 'Legal',
    title: lang === 'es' ? 'Aviso Legal' : 'Legal Notice',
    owner: lang === 'es' ? 'Datos del Titular' : 'Owner Details',
    company: lang === 'es' ? 'Empresa:' : 'Company:',
    address: lang === 'es' ? 'Dirección:' : 'Address:',
    empty: lang === 'es' ? 'El contenido de esta página está siendo preparado.' : 'The content of this page is being prepared.',
    privacyLink: lang === 'es' ? 'Política de Privacidad →' : 'Privacy Policy →',
    homeLink: lang === 'es' ? 'Inicio →' : 'Home →',
  };

  return (
    <main className="min-h-screen bg-black text-white font-sans selection:bg-brand-green selection:text-black">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/5">
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

      {/* Content */}
      <div className="pt-40 pb-32 px-6">
        <article className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-16"
          >
            {/* Title */}
            <div className="space-y-4">
              <span className="text-[10px] uppercase tracking-[0.3em] font-black text-brand-green">{t.label}</span>
              <h1 className="text-5xl md:text-7xl font-serif font-black leading-tight">{t.title}</h1>
            </div>

            {/* Company Card */}
            {!loading && (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-3">
                <h2 className="text-[10px] uppercase tracking-widest font-black text-white/30">{t.owner}</h2>
                <div className="space-y-1.5 text-sm">
                  {data.company_name && <p><span className="text-white/40 mr-2 font-bold">{t.company}</span><span className="text-white">{data.company_name}</span></p>}
                  {data.company_cif && <p><span className="text-white/40 mr-2 font-bold">CIF/NIF:</span><span className="text-white">{data.company_cif}</span></p>}
                  {data.company_address && <p><span className="text-white/40 mr-2 font-bold">{t.address}</span><span className="text-white">{data.company_address}</span></p>}
                  {data.company_email && <p><span className="text-white/40 mr-2 font-bold">Email:</span><a href={`mailto:${data.company_email}`} className="text-brand-green hover:underline">{data.company_email}</a></p>}
                </div>
              </div>
            )}

            {/* Body */}
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => <div key={i} className="h-5 bg-white/5 rounded animate-pulse" style={{ width: `${70 + i * 10}%` }} />)}
              </div>
            ) : content.trim() ? (
              <div
                className="
                  text-white/60 text-lg leading-relaxed
                  [&_h2]:text-2xl [&_h2]:font-black [&_h2]:text-white [&_h2]:mt-10 [&_h2]:mb-3 [&_h2]:uppercase [&_h2]:tracking-widest
                  [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-white/80 [&_h3]:mt-6 [&_h3]:mb-2
                  [&_p]:mb-4
                  [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ul]:space-y-1
                  [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_ol]:space-y-1
                  [&_strong]:text-white [&_strong]:font-bold
                  [&_em]:italic [&_em]:text-white/70
                  [&_a]:text-brand-green [&_a]:underline [&_a]:hover:opacity-70
                  [&_hr]:border-white/10 [&_hr]:my-8
                "
                dangerouslySetInnerHTML={{ __html: content }}
              />
            ) : (
              <p className="text-white/30 text-sm italic">{t.empty}</p>
            )}

            {/* Bottom links */}
            <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row gap-4 text-xs uppercase tracking-widest font-bold text-white/30">
              <Link href={`/politica-de-privacidad?lang=${lang}`} className="hover:text-white transition-colors">{t.privacyLink}</Link>
              <button onClick={() => router.back()} className="hover:text-white transition-colors text-left">{t.homeLink}</button>
            </div>
          </motion.div>
        </article>
      </div>

      <footer className="border-t border-white/5 py-12 bg-black">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-white/20 text-xs uppercase tracking-widest">
            © {new Date().getFullYear()} {data.company_name || 'Twenty4 Studios'}. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}

export default function LegalNotice() {
  return (
    <Suspense>
      <LegalContent />
    </Suspense>
  );
}
