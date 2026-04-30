'use client';
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { TranslationField, ImageEditor } from './components';
import { Mail, Globe, Image as ImageIcon, Settings, Library, Quote } from 'lucide-react';
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
    site_name: '',
    site_description_es: '',
    site_description_en: '',
    favicon_url: '',
    header_logo_url: '',
    footer_logo_url: '',
    loading_logo_url: '',
    email: '',
    phone: '',
    instagram_url: '',
    linkedin_url: '',
    footer_text_es: '',
    footer_text_en: ''
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

      {/* 1. SEO & METADATA */}
      <section className="bg-white/3 border border-white/8 rounded-[2.5rem] p-10 space-y-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-green/20 flex items-center justify-center text-brand-green">
            <Globe size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tighter text-white">SEO & Configuración</h2>
            <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Configuración global del sitio y motores de búsqueda</p>
          </div>
        </div>

        <div className="space-y-10">
          <div>
            <div className="flex justify-between items-center mb-3">
              <label className={labelCls}>Nombre del Sitio <span className="text-red-400">*</span></label>
              <span className={`text-[8px] font-bold tracking-widest ${data.site_name.length >= 60 ? 'text-red-500' : 'text-white/20'}`}>
                {data.site_name.length}/60
              </span>
            </div>
            <input
              type="text"
              maxLength={60}
              value={data.site_name}
              onChange={e => setData(prev => ({ ...prev, site_name: e.target.value }))}
              className={inputCls}
              placeholder="Ej: Twenty4 Studios"
            />
          </div>

          <TranslationField
            label="Descripción SEO (Meta Description)"
            type="textarea"
            maxLength={160}
            required={true}
            stacked={true}
            value={{ es: data.site_description_es, en: data.site_description_en }}
            onChange={(val) => setData(prev => ({ ...prev, site_description_es: val.es, site_description_en: val.en }))}
          />
        </div>
      </section>

      {/* 2. MARCA & ASSETS */}
      <section className="bg-white/3 border border-white/8 rounded-[2.5rem] p-10 space-y-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-400">
            <ImageIcon size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tighter text-white">Identidad Visual</h2>
            <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Logos principales, favicon y assets de marca</p>
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

      {/* 3. CONTACTO & REDES */}
      <section className="bg-white/3 border border-white/8 rounded-[2.5rem] p-10 space-y-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-orange-500/20 flex items-center justify-center text-orange-400">
            <Mail size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tighter text-white">Contacto y Redes</h2>
            <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Información de contacto y enlaces a redes sociales</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-6">
            <div>
              <label className={labelCls}>Email Principal</label>
              <input type="email" value={data.email} onChange={e => setData(prev => ({ ...prev, email: e.target.value }))} className={inputCls} placeholder="hola@twenty4studios.com" />
            </div>
            <div>
              <label className={labelCls}>Teléfono</label>
              <input type="text" value={data.phone} onChange={e => setData(prev => ({ ...prev, phone: e.target.value }))} className={inputCls} placeholder="+34 600 000 000" />
            </div>
          </div>
          <div className="space-y-6">
            <div>
              <label className={labelCls}>Instagram URL</label>
              <input type="text" value={data.instagram_url} onChange={e => setData(prev => ({ ...prev, instagram_url: e.target.value }))} className={inputCls} placeholder="https://instagram.com/..." />
            </div>
            <div>
              <label className={labelCls}>LinkedIn URL</label>
              <input type="text" value={data.linkedin_url} onChange={e => setData(prev => ({ ...prev, linkedin_url: e.target.value }))} className={inputCls} placeholder="https://linkedin.com/in/..." />
            </div>
          </div>
        </div>
      </section>

      {/* 4. FOOTER */}
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
