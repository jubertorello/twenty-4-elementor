'use client';
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { TranslationField, ImageEditor } from './components';
import { Image as ImageIcon, Quote } from 'lucide-react';
import { CloudinaryUploader } from '@/components/CloudinaryUploader';
import { deleteCloudinaryAsset } from '@/lib/cloudinary';

export const SettingsSection = ({
  saveTrigger,
  onSaveComplete,
}: {
  saveTrigger: number;
  onSaveComplete: (success?: boolean) => void;
}) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    favicon_url: '',
    header_logo_url: '',
    footer_logo_url: '',
    loading_logo_url: '',
    footer_text_es: '',
    footer_text_en: '',
  });
  const initialMount = React.useRef(true);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    const { data: res, error } = await supabase.from('site_settings').select('data').eq('id', 'general').single();
    if (error && error.code !== 'PGRST116') console.error('Error loading settings:', error);
    if (res?.data) setData(prev => ({ ...prev, ...res.data }));
    setLoading(false);
  };

  useEffect(() => {
    if (initialMount.current) { initialMount.current = false; return; }
    if (saveTrigger > 0) handleSave();
  }, [saveTrigger]);

  const handleSave = async () => {
    try {
      const { error } = await supabase.from('site_settings').upsert(
        { id: 'general', data },
        { onConflict: 'id' }
      );
      if (error) console.error('Error saving settings:', error);
      onSaveComplete(!error);
    } catch (e) {
      console.error('Unexpected error saving settings:', e);
      onSaveComplete(false);
    }
  };

  const inputCls = "w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-brand-green transition-all placeholder:text-white/20 text-sm";
  const labelCls = "text-[10px] uppercase tracking-widest font-black text-white/30 ml-1 block mb-3";

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-40 space-y-4">
      <div className="w-12 h-12 border-4 border-brand-green/20 border-t-brand-green rounded-full animate-spin" />
      <p className="text-white/20 font-black uppercase tracking-[0.3em] animate-pulse text-[10px]">Cargando Ajustes...</p>
    </div>
  );

  return (
    <div className="space-y-12 pb-32">

      {/* LOGOS & ASSETS */}
      <section className="bg-white/3 border border-white/8 rounded-[2.5rem] p-10 space-y-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-400">
            <ImageIcon size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tighter text-white">Identidad Visual & Logos</h2>
            <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Logos, favicon y assets de marca globales</p>
          </div>
        </div>

        {/* 2×2 grid — todos del mismo tamaño */}
        <div className="grid grid-cols-2 gap-6">

          {/* Favicon */}
          <div className="space-y-3">
            <label className={labelCls}>Favicon</label>
            <p className="text-[8px] text-white/20 uppercase tracking-widest font-medium">Icono de pestaña</p>
            <ImageEditor
              url={data.favicon_url}
              aspect="auto"
              objectFit="contain"
              className="!h-44 !min-h-0 bg-white/5 border-white/10"
              label="Favicon"
              onUpload={(url) => setData(prev => ({ ...prev, favicon_url: url }))}
              onDelete={() => setData(prev => ({ ...prev, favicon_url: '' }))}
            />
          </div>

          {/* Loading Screen */}
          <div className="space-y-3">
            <label className={labelCls}>Logo Loading Screen</label>
            <p className="text-[8px] text-white/20 uppercase tracking-widest font-medium">Logo durante la carga</p>
            <ImageEditor
              url={data.loading_logo_url}
              aspect="auto"
              objectFit="contain"
              className="!h-44 !min-h-0 bg-white/5 border-white/10"
              label="Logo Loading"
              onUpload={(url) => setData(prev => ({ ...prev, loading_logo_url: url }))}
              onDelete={() => setData(prev => ({ ...prev, loading_logo_url: '' }))}
            />
          </div>

          {/* Logo Header */}
          <div className="space-y-3">
            <label className={labelCls}>Logo Header</label>
            <p className="text-[8px] text-white/20 uppercase tracking-widest font-medium">Menú principal</p>
            <ImageEditor
              url={data.header_logo_url}
              aspect="auto"
              objectFit="contain"
              className="!h-44 !min-h-0 bg-white/5 border-white/10"
              label="Logo Header"
              onUpload={(url) => setData(prev => ({ ...prev, header_logo_url: url }))}
              onDelete={() => setData(prev => ({ ...prev, header_logo_url: '' }))}
            />
          </div>

          {/* Logo Footer */}
          <div className="space-y-3">
            <label className={labelCls}>Logo Footer</label>
            <p className="text-[8px] text-white/20 uppercase tracking-widest font-medium">Pie de página</p>
            <ImageEditor
              url={data.footer_logo_url}
              aspect="auto"
              objectFit="contain"
              className="!h-44 !min-h-0 bg-white/5 border-white/10"
              label="Logo Footer"
              onUpload={(url) => setData(prev => ({ ...prev, footer_logo_url: url }))}
              onDelete={() => setData(prev => ({ ...prev, footer_logo_url: '' }))}
            />
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <section className="bg-white/3 border border-white/8 rounded-[2.5rem] p-10 space-y-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/20 flex items-center justify-center text-purple-400">
            <Quote size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tighter text-white">Texto del Footer</h2>
            <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">La frase inspiracional que aparece al final de la web</p>
          </div>
        </div>

        <TranslationField
          label="Frase de Despedida"
          type="textarea"
          maxLength={200}
          required={true}
          stacked={true}
          value={{ es: data.footer_text_es, en: data.footer_text_en }}
          onChange={(val) => setData(prev => ({ ...prev, footer_text_es: val.es, footer_text_en: val.en }))}
        />
      </section>
    </div>
  );
};
