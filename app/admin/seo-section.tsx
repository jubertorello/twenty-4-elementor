'use client';
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { TranslationField, ImageEditor } from './components';
import { Globe, Share2, Mail, Phone } from 'lucide-react';

export const SeoSection = ({
  saveTrigger,
  onSaveComplete,
}: {
  saveTrigger: number;
  onSaveComplete: (success?: boolean) => void;
}) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    site_name: '',
    meta_title: '',
    site_description_es: '',
    site_description_en: '',
    og_image: '',
    email: '',
    phone: '',
    instagram_url: '',
    linkedin_url: '',
  });
  const initialMount = React.useRef(true);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    const { data: res } = await supabase
      .from('site_settings')
      .select('data')
      .eq('id', 'general')
      .single();
    if (res?.data) setData(prev => ({ ...prev, ...res.data }));
    setLoading(false);
  };

  useEffect(() => {
    if (initialMount.current) { initialMount.current = false; return; }
    if (saveTrigger > 0) handleSave();
  }, [saveTrigger]);

  const handleSave = async () => {
    try {
      // Merge with existing data so we don't overwrite other fields
      const { data: existing } = await supabase
        .from('site_settings')
        .select('data')
        .eq('id', 'general')
        .single();
      const merged = { ...(existing?.data || {}), ...data };
      const { error } = await supabase
        .from('site_settings')
        .upsert({ id: 'general', data: merged }, { onConflict: 'id' });
      onSaveComplete(!error);
    } catch {
      onSaveComplete(false);
    }
  };

  const set = (key: string, val: string) => setData(prev => ({ ...prev, [key]: val }));

  const inputCls = "w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-brand-almost-black transition-all placeholder:text-white/20 text-sm";
  const labelCls = "text-[10px] uppercase tracking-widest font-black text-white/30 ml-1 block mb-3";

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-40 space-y-4">
      <div className="w-12 h-12 border-4 border-brand-almost-black/20 border-t-brand-almost-black rounded-full animate-spin" />
      <p className="text-white/20 font-black uppercase tracking-[0.3em] animate-pulse text-[10px]">Cargando...</p>
    </div>
  );

  return (
    <div className="space-y-12 pb-32">

      {/* SEO */}
      <section className="bg-white/3 border border-white/8 rounded-[2.5rem] p-10 space-y-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-almost-black/20 flex items-center justify-center text-brand-almost-black">
            <Globe size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tighter text-white">SEO & Metadatos</h2>
            <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Cómo aparece el sitio en Google y al compartir en redes</p>
          </div>
        </div>

        <div className="space-y-8">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className={labelCls}>Nombre del Sitio</label>
                <span className={`text-[8px] font-bold tracking-widest ${data.site_name.length >= 60 ? 'text-red-500' : 'text-white/20'}`}>
                  {data.site_name.length}/60
                </span>
              </div>
              <input
                type="text"
                maxLength={60}
                value={data.site_name}
                onChange={e => set('site_name', e.target.value)}
                className={inputCls}
                placeholder="Ej: TWENTY4 STUDIOS"
              />
              <p className="text-[9px] text-white/20 mt-2 ml-1">Aparece en la pestaña y como sufijo en todos los títulos de página.</p>
            </div>
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className={labelCls}>Meta Title (home)</label>
                <span className={`text-[8px] font-bold tracking-widest ${data.meta_title.length >= 60 ? 'text-red-500' : 'text-white/20'}`}>
                  {data.meta_title.length}/60
                </span>
              </div>
              <input
                type="text"
                maxLength={60}
                value={data.meta_title}
                onChange={e => set('meta_title', e.target.value)}
                className={inputCls}
                placeholder="Ej: TWENTY4 STUDIOS | Sports & Brands"
              />
              <p className="text-[9px] text-white/20 mt-2 ml-1">Si está vacío se usa el Nombre del Sitio.</p>
            </div>
          </div>

          <TranslationField
            label="Meta Description"
            type="textarea"
            maxLength={160}
            required
            stacked
            value={{ es: data.site_description_es, en: data.site_description_en }}
            onChange={val => setData(prev => ({ ...prev, site_description_es: val.es, site_description_en: val.en }))}
          />

          {/* OG Image */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div className="space-y-3">
              <label className={labelCls}>OG Image — Open Graph</label>
              <p className="text-[9px] text-white/20 ml-1">
                Imagen al compartir en redes. Recomendado: <strong className="text-white/40">1200 × 630 px</strong>.
              </p>
              <ImageEditor
                url={data.og_image}
                aspect="auto"
                objectFit="cover"
                className="!h-40 !min-h-0 bg-white/5 border-white/10"
                label="OG Image"
                onUpload={url => set('og_image', url)}
                onDelete={() => set('og_image', '')}
              />
            </div>
            {data.og_image && (
              <div className="space-y-2">
                <p className="text-[9px] text-white/20 uppercase tracking-widest font-bold ml-1">Vista previa al compartir</p>
                <div className="rounded-xl overflow-hidden border border-white/10 max-w-xs">
                  <img src={data.og_image} alt="OG preview" className="w-full aspect-[1200/630] object-cover" />
                  <div className="bg-white px-3 py-2 border-t border-gray-100">
                    <p className="text-[10px] text-gray-400 uppercase tracking-wide truncate">{(process.env.NEXT_PUBLIC_SITE_URL || 'twenty4studios.com').replace(/^https?:\/\//, '')}</p>
                    <p className="text-[13px] font-semibold text-gray-900 leading-snug line-clamp-1">{data.meta_title || data.site_name || 'TWENTY4 STUDIOS'}</p>
                    <p className="text-[11px] text-gray-500 line-clamp-1">{data.site_description_es}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      </section>

      {/* Redes Sociales & Contacto */}
      <section className="bg-white/3 border border-white/8 rounded-[2.5rem] p-10 space-y-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-orange-500/20 flex items-center justify-center text-orange-400">
            <Share2 size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tighter text-white">Redes Sociales & Contacto</h2>
            <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Aparecen en el footer, JSON-LD y formulario de contacto</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label className={labelCls}><Mail size={11} className="inline mr-1" />Email Principal</label>
              <input type="email" value={data.email} onChange={e => set('email', e.target.value)} className={inputCls} placeholder="hola@twenty4studios.com" />
            </div>
            <div>
              <label className={labelCls}><Phone size={11} className="inline mr-1" />Teléfono</label>
              <input type="text" value={data.phone} onChange={e => set('phone', e.target.value)} className={inputCls} placeholder="+34 600 000 000" />
            </div>
          </div>
          <div className="space-y-6">
            <div>
              <label className={labelCls}>Instagram URL</label>
              <input type="url" value={data.instagram_url} onChange={e => set('instagram_url', e.target.value)} className={inputCls} placeholder="https://instagram.com/twenty4studios" />
            </div>
            <div>
              <label className={labelCls}>LinkedIn URL</label>
              <input type="url" value={data.linkedin_url} onChange={e => set('linkedin_url', e.target.value)} className={inputCls} placeholder="https://linkedin.com/company/twenty4studios" />
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
